const FeaturedContent = require('../models/FeaturedContent');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const Playlist = require('../models/Playlist');

// @desc    Get landing page content
// @route   GET /api/landing-page
// @access  Public
exports.getLandingPage = async (req, res) => {
  try {
    const now = new Date();

    // Get active featured content for all sections
    const featuredContent = await FeaturedContent.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: now } }
      ]
    })
      .populate('content')
      .sort({ section: 1, priority: -1 });

    // Group by section
    const sections = {
      hero: [],
      trending: [],
      new_releases: [],
      recommended: [],
      top_charts: [],
      featured_artists: []
    };

    featuredContent.forEach(item => {
      if (sections[item.section]) {
        sections[item.section].push(item);
      }
    });

    res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create featured content (Admin)
// @route   POST /api/landing-page/featured
// @access  Private/Admin
exports.createFeaturedContent = async (req, res) => {
  try {
    const {
      contentType,
      contentId,
      section,
      priority,
      title,
      description,
      customImage,
      startDate,
      endDate
    } = req.body;

    // Determine content model
    const contentModelMap = {
      song: 'Song',
      album: 'Album',
      playlist: 'Playlist',
      artist: 'Artist'
    };

    const featured = await FeaturedContent.create({
      contentType,
      content: contentId,
      contentModel: contentModelMap[contentType],
      section,
      priority: priority || 0,
      title,
      description,
      customImage,
      startDate: startDate || Date.now(),
      endDate
    });

    const populated = await FeaturedContent.findById(featured._id).populate('content');

    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all featured content (Admin)
// @route   GET /api/landing-page/featured/all
// @access  Private/Admin
exports.getAllFeaturedContent = async (req, res) => {
  try {
    const section = req.query.section;
    const query = section ? { section } : {};

    const featured = await FeaturedContent.find(query)
      .populate('content')
      .sort({ section: 1, priority: -1, createdAt: -1 });

    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update featured content (Admin)
// @route   PUT /api/landing-page/featured/:id
// @access  Private/Admin
exports.updateFeaturedContent = async (req, res) => {
  try {
    const featured = await FeaturedContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('content');

    if (!featured) {
      return res.status(404).json({
        success: false,
        message: 'Featured content not found'
      });
    }

    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete featured content (Admin)
// @route   DELETE /api/landing-page/featured/:id
// @access  Private/Admin
exports.deleteFeaturedContent = async (req, res) => {
  try {
    const featured = await FeaturedContent.findById(req.params.id);

    if (!featured) {
      return res.status(404).json({
        success: false,
        message: 'Featured content not found'
      });
    }

    await featured.deleteOne();

    res.json({
      success: true,
      message: 'Featured content deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reorder featured content (Admin)
// @route   POST /api/landing-page/featured/reorder
// @access  Private/Admin
exports.reorderFeaturedContent = async (req, res) => {
  try {
    const { section, items } = req.body; // items: [{ id, priority }, ...]

    // Update priorities
    const updates = items.map(item =>
      FeaturedContent.findByIdAndUpdate(item.id, { priority: item.priority })
    );

    await Promise.all(updates);

    res.json({
      success: true,
      message: 'Featured content reordered successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Record click on featured content
// @route   POST /api/landing-page/featured/:id/click
// @access  Public
exports.recordClick = async (req, res) => {
  try {
    const featured = await FeaturedContent.findById(req.params.id);

    if (featured) {
      featured.clickCount += 1;
      await featured.save();
    }

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
