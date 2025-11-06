const User = require('../models/User');
const PlayHistory = require('../models/PlayHistory');

// @desc    Get user's liked songs
// @route   GET /api/users/liked-songs
// @access  Private
exports.getLikedSongs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'likedSongs',
        populate: {
          path: 'artist',
          select: 'name profileImage'
        }
      });

    res.json({
      success: true,
      data: user.likedSongs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's play history
// @route   GET /api/users/play-history
// @access  Private
exports.getPlayHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const history = await PlayHistory.find({ user: req.user._id })
      .populate({
        path: 'song',
        populate: {
          path: 'artist',
          select: 'name profileImage'
        }
      })
      .sort({ playedAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get followed artists
// @route   GET /api/users/followed-artists
// @access  Private
exports.getFollowedArtists = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followedArtists');

    res.json({
      success: true,
      data: user.followedArtists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
