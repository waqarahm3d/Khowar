const ArtistVerification = require('../models/ArtistVerification');
const User = require('../models/User');
const Artist = require('../models/Artist');
const ArtistAnalytics = require('../models/ArtistAnalytics');
const emailService = require('../services/emailService');

// @desc    Apply for artist verification
// @route   POST /api/artist-verification/apply
// @access  Private
exports.applyForVerification = async (req, res) => {
  try {
    const {
      artistName,
      realName,
      bio,
      genre,
      socialLinks,
      verificationDocuments,
      previousReleases
    } = req.body;

    // Check if user already has a pending or approved application
    const existingApplication = await ArtistVerification.findOne({
      user: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: existingApplication.status === 'approved'
          ? 'You are already a verified artist'
          : 'You already have a pending application'
      });
    }

    // Create verification application
    const application = await ArtistVerification.create({
      user: req.user._id,
      artistName,
      realName,
      bio,
      genre,
      socialLinks,
      verificationDocuments,
      previousReleases
    });

    // Update user status
    await User.findByIdAndUpdate(req.user._id, {
      artistVerificationStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted for review',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's verification application
// @route   GET /api/artist-verification/my-application
// @access  Private
exports.getMyApplication = async (req, res) => {
  try {
    const application = await ArtistVerification.findOne({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all verification applications (Admin)
// @route   GET /api/artist-verification/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const status = req.query.status || 'pending';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = status === 'all' ? {} : { status };

    const applications = await ArtistVerification.find(query)
      .populate('user', 'username email displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ArtistVerification.countDocuments(query);

    res.json({
      success: true,
      data: applications,
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

// @desc    Review verification application (Admin)
// @route   PUT /api/artist-verification/:id/review
// @access  Private/Admin
exports.reviewApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    if (!['approved', 'rejected', 'needs_info'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await ArtistVerification.findById(id).populate('user');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application
    application.status = status;
    application.reviewedBy = req.user._id;
    application.reviewNotes = reviewNotes;
    application.reviewedAt = new Date();
    await application.save();

    // Update user
    const user = await User.findById(application.user._id);

    if (status === 'approved') {
      // Create artist profile
      const artist = await Artist.create({
        name: application.artistName,
        bio: application.bio,
        genres: application.genre,
        verified: true,
        socialLinks: application.socialLinks
      });

      // Update user
      user.artistVerificationStatus = 'approved';
      user.role = 'artist';
      user.artistProfile = artist._id;
      await user.save();

      // Create analytics record for artist
      await ArtistAnalytics.create({
        artist: artist._id
      });

      // Send approval email
      await emailService.sendArtistVerificationEmail(
        user.email,
        user.displayName,
        true
      );
    } else if (status === 'rejected') {
      user.artistVerificationStatus = 'rejected';
      await user.save();

      // Send rejection email
      await emailService.sendArtistVerificationEmail(
        user.email,
        user.displayName,
        false
      );
    } else {
      user.artistVerificationStatus = 'needs_info';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Application reviewed successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get artist analytics (For verified artists)
// @route   GET /api/artist-verification/analytics
// @access  Private (Artist only)
exports.getArtistAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.artistProfile) {
      return res.status(403).json({
        success: false,
        message: 'You are not a verified artist'
      });
    }

    const analytics = await ArtistAnalytics.findOne({ artist: user.artistProfile });

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics data not found'
      });
    }

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get artist detailed stats (For verified artists)
// @route   GET /api/artist-verification/stats
// @access  Private (Artist only)
exports.getArtistStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('artistProfile');

    if (!user.artistProfile) {
      return res.status(403).json({
        success: false,
        message: 'You are not a verified artist'
      });
    }

    const Song = require('../models/Song');
    const PlayHistory = require('../models/PlayHistory');
    const Comment = require('../models/Comment');
    const SocialShare = require('../models/SocialShare');

    // Get all songs by this artist
    const songs = await Song.find({ artist: user.artistProfile._id });
    const songIds = songs.map(s => s._id);

    // Calculate statistics
    const totalPlays = songs.reduce((sum, song) => sum + song.playCount, 0);
    const totalLikes = songs.reduce((sum, song) => sum + song.likeCount, 0);

    // Get play history for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPlays = await PlayHistory.countDocuments({
      song: { $in: songIds },
      playedAt: { $gte: thirtyDaysAgo }
    });

    // Get comments count
    const totalComments = await Comment.countDocuments({
      song: { $in: songIds }
    });

    // Get shares count
    const totalShares = await SocialShare.countDocuments({
      song: { $in: songIds }
    });

    // Get top songs
    const topSongs = await Song.find({ artist: user.artistProfile._id })
      .sort({ playCount: -1 })
      .limit(10)
      .select('title playCount likeCount coverImage');

    res.json({
      success: true,
      data: {
        overview: {
          totalSongs: songs.length,
          totalPlays,
          totalLikes,
          totalComments,
          totalShares,
          recentPlays,
          followers: user.artistProfile.followers
        },
        topSongs
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
