const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const PlayHistory = require('../models/PlayHistory');
const Comment = require('../models/Comment');
const SocialShare = require('../models/SocialShare');
const ArtistVerification = require('../models/ArtistVerification');
const storageService = require('../services/storageService');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Artist.countDocuments();
    const totalAlbums = await Album.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();
    const totalPlays = await PlayHistory.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalShares = await SocialShare.countDocuments();

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Pending artist verification applications
    const pendingVerifications = await ArtistVerification.countDocuments({ status: 'pending' });

    // Get most played songs
    const topSongs = await Song.find()
      .populate('artist', 'name')
      .sort({ playCount: -1 })
      .limit(10);

    // Get most followed artists
    const topArtists = await Artist.find()
      .sort({ followers: -1 })
      .limit(10);

    // Get storage info
    const storageInfo = storageService.getInfo();

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSongs,
          totalArtists,
          totalAlbums,
          totalPlaylists,
          totalPlays,
          totalComments,
          totalShares,
          recentUsers,
          pendingVerifications
        },
        topSongs,
        topArtists,
        storage: storageInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
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

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload audio file
// @route   POST /api/admin/upload/audio
// @access  Private/Admin
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file'
      });
    }

    // Upload to configured storage provider
    const audioUrl = await storageService.upload(req.file, 'audio');

    res.json({
      success: true,
      data: {
        audioUrl,
        filename: req.file.originalname,
        size: req.file.size,
        provider: storageService.provider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload image file
// @route   POST /api/admin/upload/image
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // Upload to configured storage provider
    const imageUrl = await storageService.upload(req.file, 'images');

    res.json({
      success: true,
      data: {
        imageUrl,
        filename: req.file.originalname,
        size: req.file.size,
        provider: storageService.provider
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
  try {
    // Plays over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const playsOverTime = await PlayHistory.aggregate([
      { $match: { playedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$playedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // New users over time
    const newUsersOverTime = await User.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top genres
    const topGenres = await Song.aggregate([
      { $unwind: '$genre' },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        playsOverTime,
        newUsersOverTime,
        topGenres
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
