const OfflineDownload = require('../models/OfflineDownload');
const Song = require('../models/Song');
const crypto = require('crypto');

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);

// @desc    Request offline download
// @route   POST /api/offline/download
// @access  Private
exports.requestDownload = async (req, res) => {
  try {
    const { songId, deviceId } = req.body;

    if (!songId || !deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Song ID and device ID are required'
      });
    }

    // Check if song exists
    const song = await Song.findById(songId).populate('artist album');

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Check if user already has active download for this song
    const existingDownload = await OfflineDownload.findOne({
      user: req.user._id,
      song: songId,
      deviceId,
      isActive: true
    });

    if (existingDownload) {
      return res.json({
        success: true,
        data: {
          downloadToken: existingDownload.downloadToken,
          encryptionKey: existingDownload.encryptionKey,
          expiresAt: existingDownload.expiresAt,
          song: {
            _id: song._id,
            title: song.title,
            artist: song.artist.name,
            album: song.album?.title,
            duration: song.duration,
            coverImage: song.coverImage
          }
        }
      });
    }

    // Generate encryption key and download token
    const encryptionKey = crypto.randomBytes(32).toString('hex');
    const downloadToken = crypto.randomBytes(32).toString('hex');

    // Create download record
    const download = await OfflineDownload.create({
      user: req.user._id,
      song: songId,
      encryptionKey,
      downloadToken,
      deviceId
    });

    res.json({
      success: true,
      data: {
        downloadToken,
        encryptionKey,
        expiresAt: download.expiresAt,
        song: {
          _id: song._id,
          title: song.title,
          artist: song.artist.name,
          album: song.album?.title,
          duration: song.duration,
          coverImage: song.coverImage
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download encrypted song
// @route   GET /api/offline/download/:token
// @access  Private
exports.downloadSong = async (req, res) => {
  try {
    const { token } = req.params;

    // Find download record
    const download = await OfflineDownload.findOne({
      downloadToken: token,
      isActive: true
    }).populate('song');

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired download token'
      });
    }

    // Check if expired
    if (download.expiresAt < Date.now()) {
      download.isActive = false;
      await download.save();

      return res.status(410).json({
        success: false,
        message: 'Download link has expired'
      });
    }

    // Verify user
    if (download.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this song'
      });
    }

    const song = download.song;

    // Get original audio file path
    const filePath = path.join(__dirname, '..', song.audioUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Audio file not found'
      });
    }

    // Read file
    const audioBuffer = fs.readFileSync(filePath);

    // Encrypt audio
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM,
      Buffer.from(download.encryptionKey, 'hex'),
      iv
    );

    const encrypted = Buffer.concat([cipher.update(audioBuffer), cipher.final()]);

    // Create metadata
    const metadata = {
      songId: song._id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      coverImage: song.coverImage,
      downloadToken: token,
      iv: iv.toString('hex')
    };

    // Send encrypted file with metadata
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="qoqnuz_${song._id}.qnz"`);
    res.setHeader('X-Qoqnuz-Metadata', JSON.stringify(metadata));

    res.send(encrypted);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's offline downloads
// @route   GET /api/offline/my-downloads
// @access  Private
exports.getMyDownloads = async (req, res) => {
  try {
    const downloads = await OfflineDownload.find({
      user: req.user._id,
      isActive: true
    })
      .populate({
        path: 'song',
        populate: {
          path: 'artist album',
          select: 'name title coverImage'
        }
      })
      .sort({ downloadedAt: -1 });

    // Filter out expired downloads
    const activeDownloads = downloads.filter(d => d.expiresAt > Date.now());

    res.json({
      success: true,
      data: activeDownloads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify offline playback
// @route   POST /api/offline/verify-playback
// @access  Private
exports.verifyPlayback = async (req, res) => {
  try {
    const { downloadToken, deviceId } = req.body;

    const download = await OfflineDownload.findOne({
      downloadToken,
      user: req.user._id,
      deviceId,
      isActive: true
    });

    if (!download) {
      return res.status(403).json({
        success: false,
        message: 'Invalid download or device'
      });
    }

    if (download.expiresAt < Date.now()) {
      download.isActive = false;
      await download.save();

      return res.status(410).json({
        success: false,
        message: 'Download has expired. Please download again.'
      });
    }

    // Update play stats
    download.lastPlayedAt = Date.now();
    download.playCount += 1;
    await download.save();

    res.json({
      success: true,
      data: {
        valid: true,
        expiresAt: download.expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete offline download
// @route   DELETE /api/offline/download/:id
// @access  Private
exports.deleteDownload = async (req, res) => {
  try {
    const download = await OfflineDownload.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!download) {
      return res.status(404).json({
        success: false,
        message: 'Download not found'
      });
    }

    download.isActive = false;
    await download.save();

    res.json({
      success: true,
      message: 'Download deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
