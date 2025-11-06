const Album = require('../models/Album');
const Song = require('../models/Song');

// @desc    Get all albums
// @route   GET /api/albums
// @access  Public
exports.getAllAlbums = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const albums = await Album.find()
      .populate('artist', 'name profileImage verified')
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Album.countDocuments();

    res.json({
      success: true,
      data: albums,
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

// @desc    Get single album
// @route   GET /api/albums/:id
// @access  Public
exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id)
      .populate('artist', 'name profileImage bio verified');

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.json({
      success: true,
      data: album
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create album
// @route   POST /api/albums
// @access  Private/Admin
exports.createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body);

    res.status(201).json({
      success: true,
      data: album
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Private/Admin
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.json({
      success: true,
      data: album
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Private/Admin
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    await album.deleteOne();

    res.json({
      success: true,
      message: 'Album deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get album songs
// @route   GET /api/albums/:id/songs
// @access  Public
exports.getAlbumSongs = async (req, res) => {
  try {
    const songs = await Song.find({ album: req.params.id })
      .populate('artist', 'name profileImage verified')
      .sort({ trackNumber: 1 });

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

// @desc    Search albums
// @route   GET /api/albums/search
// @access  Public
exports.searchAlbums = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const albums = await Album.find({
      title: { $regex: q, $options: 'i' }
    })
      .populate('artist', 'name profileImage')
      .limit(50);

    res.json({
      success: true,
      data: albums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
