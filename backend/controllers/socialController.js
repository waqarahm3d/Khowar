const SocialShare = require('../models/SocialShare');
const Song = require('../models/Song');

// @desc    Record a social share
// @route   POST /api/social/share
// @access  Private
exports.recordShare = async (req, res) => {
  try {
    const { songId, platform } = req.body;

    if (!songId || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Song ID and platform are required'
      });
    }

    // Verify song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Create share record
    await SocialShare.create({
      user: req.user._id,
      song: songId,
      platform
    });

    res.json({
      success: true,
      message: 'Share recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get share statistics for a song
// @route   GET /api/social/song/:songId/shares
// @access  Public
exports.getSongShares = async (req, res) => {
  try {
    const { songId } = req.params;

    // Total shares
    const totalShares = await SocialShare.countDocuments({ song: songId });

    // Shares by platform
    const sharesByPlatform = await SocialShare.aggregate([
      { $match: { song: mongoose.Types.ObjectId(songId) } },
      { $group: { _id: '$platform', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalShares,
        byPlatform: sharesByPlatform
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's sharing history
// @route   GET /api/social/my-shares
// @access  Private
exports.getMyShares = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const shares = await SocialShare.find({ user: req.user._id })
      .populate({
        path: 'song',
        select: 'title coverImage artist',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .sort({ sharedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SocialShare.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: shares,
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

// @desc    Get platform-wide sharing statistics (Admin)
// @route   GET /api/social/stats
// @access  Private/Admin
exports.getSharingStats = async (req, res) => {
  try {
    const totalShares = await SocialShare.countDocuments();

    // Shares by platform
    const sharesByPlatform = await SocialShare.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Most shared songs
    const mostSharedSongs = await SocialShare.aggregate([
      { $group: { _id: '$song', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'songs',
          localField: '_id',
          foreignField: '_id',
          as: 'songData'
        }
      },
      { $unwind: '$songData' },
      {
        $project: {
          _id: 1,
          count: 1,
          title: '$songData.title',
          coverImage: '$songData.coverImage'
        }
      }
    ]);

    // Shares over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sharesOverTime = await SocialShare.aggregate([
      { $match: { sharedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$sharedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalShares,
        sharesByPlatform,
        mostSharedSongs,
        sharesOverTime
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
