const Song = require('../models/Song');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const PlayHistory = require('../models/PlayHistory');
const fs = require('fs');
const path = require('path');

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
exports.getAllSongs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const songs = await Song.find()
      .populate('artist', 'name profileImage verified')
      .populate('album', 'title coverImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Song.countDocuments();

    res.json({
      success: true,
      data: songs,
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

// @desc    Get single song
// @route   GET /api/songs/:id
// @access  Public
exports.getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('artist', 'name profileImage bio verified')
      .populate('album', 'title coverImage releaseDate')
      .populate('featuredArtists', 'name profileImage');

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Check if user has liked this song
    let isLiked = false;
    if (req.user) {
      isLiked = req.user.likedSongs.includes(song._id);
    }

    res.json({
      success: true,
      data: { ...song.toObject(), isLiked }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new song
// @route   POST /api/songs
// @access  Private/Admin
exports.createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);

    // Update album track count
    if (song.album) {
      const album = await Album.findById(song.album);
      if (album) {
        album.totalTracks += 1;
        album.duration += song.duration;
        await album.save();
      }
    }

    res.status(201).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private/Admin
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private/Admin
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Update album if exists
    if (song.album) {
      const album = await Album.findById(song.album);
      if (album) {
        album.totalTracks -= 1;
        album.duration -= song.duration;
        await album.save();
      }
    }

    await song.deleteOne();

    res.json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Stream song
// @route   GET /api/songs/:id/stream
// @access  Public
exports.streamSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Check if file exists
    const filePath = path.join(__dirname, '..', song.audioUrl);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Audio file not found'
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for seeking
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'audio/mpeg',
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Stream entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'audio/mpeg',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like a song
// @route   POST /api/songs/:id/like
// @access  Private
exports.likeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.likedSongs.includes(song._id)) {
      return res.status(400).json({
        success: false,
        message: 'Song already liked'
      });
    }

    user.likedSongs.push(song._id);
    song.likeCount += 1;

    await user.save();
    await song.save();

    res.json({
      success: true,
      message: 'Song liked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unlike a song
// @route   DELETE /api/songs/:id/like
// @access  Private
exports.unlikeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.likedSongs.includes(song._id)) {
      return res.status(400).json({
        success: false,
        message: 'Song not liked yet'
      });
    }

    user.likedSongs = user.likedSongs.filter(id => id.toString() !== song._id.toString());
    song.likeCount = Math.max(0, song.likeCount - 1);

    await user.save();
    await song.save();

    res.json({
      success: true,
      message: 'Song unliked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Record play history
// @route   POST /api/songs/:id/play
// @access  Public (with optional auth)
exports.recordPlay = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Increment play count
    song.playCount += 1;
    await song.save();

    // Record in play history only if user is authenticated
    if (req.user) {
      await PlayHistory.create({
        user: req.user._id,
        song: song._id,
        duration: req.body.duration || song.duration,
        completedPercentage: req.body.completedPercentage || 100
      });
    }

    res.json({
      success: true,
      message: 'Play recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search songs
// @route   GET /api/songs/search
// @access  Public
exports.searchSongs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { lyrics: { $regex: q, $options: 'i' } }
      ]
    })
      .populate('artist', 'name profileImage')
      .populate('album', 'title coverImage')
      .limit(50);

    res.json({
      success: true,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trending songs
// @route   GET /api/songs/trending
// @access  Public
exports.getTrendingSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const songs = await Song.find()
      .populate('artist', 'name profileImage verified')
      .populate('album', 'title coverImage')
      .sort({ playCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get recent songs
// @route   GET /api/songs/recent
// @access  Public
exports.getRecentSongs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const songs = await Song.find()
      .populate('artist', 'name profileImage verified')
      .populate('album', 'title coverImage')
      .sort({ releaseDate: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
