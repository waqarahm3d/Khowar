const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Disable/Enable user account
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow disabling admin users
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot disable admin users'
      });
    }

    // Toggle status by adding/removing a disabled field
    user.isDisabled = !user.isDisabled;
    await user.save();

    res.json({
      success: true,
      message: user.isDisabled ? 'User disabled successfully' : 'User enabled successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change user password (Admin)
// @route   PUT /api/admin/users/:id/change-password
// @access  Private/Admin
exports.changeUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow changing admin passwords
    if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot change passwords of other admin users'
      });
    }

    // Hash and set new password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user profile details (Admin)
// @route   GET /api/admin/users/:id/profile
// @access  Private/Admin
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('likedSongs')
      .populate('playlists')
      .populate('followedArtists')
      .populate('artistProfile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const PlayHistory = require('../models/PlayHistory');
    const Comment = require('../models/Comment');
    const SocialShare = require('../models/SocialShare');

    const totalPlays = await PlayHistory.countDocuments({ user: user._id });
    const totalComments = await Comment.countDocuments({ user: user._id });
    const totalShares = await SocialShare.countDocuments({ user: user._id });

    // Recent activity
    const recentPlays = await PlayHistory.find({ user: user._id })
      .populate({
        path: 'song',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .sort({ playedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        stats: {
          totalPlays,
          totalComments,
          totalShares,
          totalLikedSongs: user.likedSongs.length,
          totalPlaylists: user.playlists.length,
          totalFollowedArtists: user.followedArtists.length
        },
        recentActivity: recentPlays
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user role (Admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'artist', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Grant/Revoke premium access
// @route   PUT /api/admin/users/:id/premium
// @access  Private/Admin
exports.togglePremium = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isPremium = !user.isPremium;
    await user.save();

    res.json({
      success: true,
      message: user.isPremium ? 'Premium access granted' : 'Premium access revoked',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search users (Admin)
// @route   GET /api/admin/users/search
// @access  Private/Admin
exports.searchUsers = async (req, res) => {
  try {
    const { q, role, isPremium, emailVerified } = req.query;

    const query = {};

    if (q) {
      query.$or = [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ];
    }

    if (role) query.role = role;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    if (emailVerified !== undefined) query.emailVerified = emailVerified === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Bulk update users (Admin)
// @route   POST /api/admin/users/bulk-update
// @access  Private/Admin
exports.bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    // Prevent updating admin users
    const users = await User.find({ _id: { $in: userIds }, role: { $ne: 'admin' } });

    if (users.length !== userIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bulk update admin users'
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updates }
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users updated successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
