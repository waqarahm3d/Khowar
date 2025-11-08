const ImportJob = require('../models/ImportJob');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const youtubeService = require('../services/youtubeImportService');
const path = require('path');
const fs = require('fs').promises;

// @desc    Check dependencies
// @route   GET /api/youtube-import/check-dependencies
// @access  Private/Admin
exports.checkDependencies = async (req, res) => {
  try {
    const dependencies = await youtubeService.checkDependencies();

    const allInstalled = dependencies.ytdlp && dependencies.ffmpeg;

    res.json({
      success: true,
      data: {
        ytdlp: dependencies.ytdlp,
        ffmpeg: dependencies.ffmpeg,
        ready: allInstalled
      },
      message: allInstalled
        ? 'All dependencies are installed'
        : 'Some dependencies are missing. Please install yt-dlp and/or ffmpeg'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Validate YouTube URL
// @route   POST /api/youtube-import/validate
// @access  Private/Admin
exports.validateUrl = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const isValid = youtubeService.validateUrl(url);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const type = youtubeService.getUrlType(url);
    const videoId = youtubeService.extractVideoId(url);

    res.json({
      success: true,
      data: {
        valid: true,
        type,
        videoId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Fetch metadata from YouTube
// @route   POST /api/youtube-import/metadata
// @access  Private/Admin
exports.fetchMetadata = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    if (!youtubeService.validateUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    const metadata = await youtubeService.fetchMetadata(url);

    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get playlist/channel videos
// @route   POST /api/youtube-import/playlist-videos
// @access  Private/Admin
exports.getPlaylistVideos = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    const type = youtubeService.getUrlType(url);

    if (type === 'single') {
      return res.status(400).json({
        success: false,
        message: 'URL is not a playlist or channel'
      });
    }

    const videos = await youtubeService.getPlaylistVideos(url);

    res.json({
      success: true,
      data: {
        type,
        count: videos.length,
        videos
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Import single video
// @route   POST /api/youtube-import/import
// @access  Private/Admin
exports.importVideo = async (req, res) => {
  try {
    const { url, artist, album, genre, tags } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL is required'
      });
    }

    if (!youtubeService.validateUrl(url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL'
      });
    }

    // Create import job
    const job = await ImportJob.create({
      admin: req.user._id,
      youtubeUrl: url,
      type: 'single',
      status: 'pending',
      settings: {
        overrideArtist: artist,
        overrideAlbum: album,
        overrideGenre: genre,
        overrideTags: tags
      }
    });

    // Start import process asynchronously
    processImport(job._id).catch(error => {
      console.error('Import process failed:', error);
    });

    res.json({
      success: true,
      data: {
        jobId: job._id,
        status: 'pending',
        message: 'Import started. Check job status for progress.'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get import job status
// @route   GET /api/youtube-import/status/:jobId
// @access  Private/Admin
exports.getJobStatus = async (req, res) => {
  try {
    const job = await ImportJob.findById(req.params.jobId)
      .populate('result.songId', 'title artist audioUrl');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job belongs to requesting admin
    if (job.admin.toString() !== req.user._id.toString() && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all import jobs
// @route   GET /api/youtube-import/jobs
// @access  Private/Admin
exports.getAllJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = req.user.role === 'superAdmin' ? {} : { admin: req.user._id };

    const jobs = await ImportJob.find(query)
      .populate('admin', 'displayName email')
      .populate('result.songId', 'title artist')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ImportJob.countDocuments(query);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel import job
// @route   DELETE /api/youtube-import/cancel/:jobId
// @access  Private/Admin
exports.cancelJob = async (req, res) => {
  try {
    const job = await ImportJob.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job belongs to requesting admin
    if (job.admin.toString() !== req.user._id.toString() && req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (job.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed job'
      });
    }

    job.status = 'cancelled';
    await job.save();

    // Cleanup temp files
    await youtubeService.cleanupTempFiles(job._id.toString());

    res.json({
      success: true,
      message: 'Job cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to process import asynchronously
async function processImport(jobId) {
  let job = await ImportJob.findById(jobId);

  if (!job) {
    console.error('Job not found:', jobId);
    return;
  }

  try {
    // Update status to processing
    job.status = 'processing';
    job.progress.currentStep = 'Fetching metadata...';
    job.progress.percentage = 5;
    await job.save();

    // Fetch metadata
    const metadata = await youtubeService.fetchMetadata(job.youtubeUrl);
    job.metadata = metadata;
    job.progress.percentage = 15;
    job.progress.currentStep = 'Metadata fetched';
    await job.save();

    // Download audio
    const progressCallback = async (step, percentage) => {
      job.progress.currentStep = step;
      job.progress.percentage = percentage;
      await job.save();
    };

    const audioPath = await youtubeService.downloadAudio(
      job.youtubeUrl,
      jobId.toString(),
      progressCallback
    );

    job.progress.percentage = 60;
    job.progress.currentStep = 'Audio downloaded';
    await job.save();

    // Download thumbnail
    let thumbnailPath = null;
    if (metadata.thumbnail) {
      job.progress.currentStep = 'Downloading thumbnail...';
      job.progress.percentage = 65;
      await job.save();

      thumbnailPath = await youtubeService.downloadThumbnail(
        metadata.thumbnail,
        jobId.toString()
      );
    }

    job.progress.percentage = 70;
    job.progress.currentStep = 'Processing files...';
    await job.save();

    // Move files to final destination
    const uploadsDir = path.join(__dirname, '../uploads/songs');
    const songFilename = `${Date.now()}_${jobId}`;
    const finalAudioPath = await youtubeService.moveToFinalDestination(
      audioPath,
      uploadsDir,
      songFilename
    );

    let finalThumbnailPath = null;
    if (thumbnailPath) {
      const thumbnailsDir = path.join(__dirname, '../uploads/thumbnails');
      finalThumbnailPath = await youtubeService.moveToFinalDestination(
        thumbnailPath,
        thumbnailsDir,
        songFilename
      );
    }

    job.progress.percentage = 80;
    job.progress.currentStep = 'Creating song record...';
    await job.save();

    // Find or create artist
    let artistId = job.settings.overrideArtist;
    if (!artistId) {
      // Try to find existing artist by name
      let artist = await Artist.findOne({
        name: { $regex: new RegExp(`^${metadata.artist}$`, 'i') }
      });

      if (!artist) {
        // Create new artist
        artist = await Artist.create({
          name: metadata.artist,
          bio: `Imported from YouTube: ${metadata.uploader}`,
          verified: false
        });
      }

      artistId = artist._id;
    }

    // Create song record
    const song = await Song.create({
      title: metadata.title,
      artist: artistId,
      album: job.settings.overrideAlbum || null,
      genre: job.settings.overrideGenre || 'Other',
      duration: metadata.duration || 0,
      releaseYear: metadata.uploadDate ? parseInt(metadata.uploadDate.substring(0, 4)) : new Date().getFullYear(),
      audioUrl: `/uploads/songs/${path.basename(finalAudioPath)}`,
      coverImage: finalThumbnailPath ? `/uploads/thumbnails/${path.basename(finalThumbnailPath)}` : null,
      tags: job.settings.overrideTags || metadata.tags || [],
      youtubeUrl: job.youtubeUrl,
      imported: true,
      importDate: new Date()
    });

    job.progress.percentage = 100;
    job.progress.currentStep = 'Completed!';
    job.status = 'completed';
    job.result = {
      songId: song._id,
      audioUrl: song.audioUrl,
      coverImage: song.coverImage
    };
    await job.save();

    // Cleanup temp files
    await youtubeService.cleanupTempFiles(jobId.toString());

    console.log(`Import completed successfully: ${jobId}`);
  } catch (error) {
    console.error(`Import failed for job ${jobId}:`, error);

    job.status = 'failed';
    job.error = {
      message: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      timestamp: new Date(),
      stack: error.stack
    };
    await job.save();

    // Cleanup temp files
    await youtubeService.cleanupTempFiles(jobId.toString());
  }
}

module.exports = { processImport };
