const Artist = require('../models/Artist');
const Song = require('../models/Song');
const Album = require('../models/Album');
const User = require('../models/User');

// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
exports.getAllArtists = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const artists = await Artist.find()
      .sort({ followers: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Artist.countDocuments();

    res.json({
      success: true,
      data: artists,
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

// @desc    Get single artist
// @route   GET /api/artists/:id
// @access  Public
exports.getArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    // Check if user follows this artist
    let isFollowing = false;
    if (req.user) {
      isFollowing = req.user.followedArtists.includes(artist._id);
    }

    res.json({
      success: true,
      data: { ...artist.toObject(), isFollowing }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create artist
// @route   POST /api/artists
// @access  Private/Admin
exports.createArtist = async (req, res) => {
  try {
    const artist = await Artist.create(req.body);

    res.status(201).json({
      success: true,
      data: artist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update artist
// @route   PUT /api/artists/:id
// @access  Private/Admin
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    res.json({
      success: true,
      data: artist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete artist
// @route   DELETE /api/artists/:id
// @access  Private/Admin
exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    await artist.deleteOne();

    res.json({
      success: true,
      message: 'Artist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get artist songs
// @route   GET /api/artists/:id/songs
// @access  Public
exports.getArtistSongs = async (req, res) => {
  try {
    const songs = await Song.find({ artist: req.params.id })
      .populate('album', 'title coverImage')
      .sort({ releaseDate: -1 });

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

// @desc    Get artist albums
// @route   GET /api/artists/:id/albums
// @access  Public
exports.getArtistAlbums = async (req, res) => {
  try {
    const albums = await Album.find({ artist: req.params.id })
      .populate('artist', 'name profileImage')
      .sort({ releaseDate: -1 });

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

// @desc    Follow artist
// @route   POST /api/artists/:id/follow
// @access  Private
exports.followArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (user.followedArtists.includes(artist._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this artist'
      });
    }

    user.followedArtists.push(artist._id);
    artist.followers += 1;

    await user.save();
    await artist.save();

    res.json({
      success: true,
      message: 'Artist followed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unfollow artist
// @route   DELETE /api/artists/:id/follow
// @access  Private
exports.unfollowArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);

    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artist not found'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user.followedArtists.includes(artist._id)) {
      return res.status(400).json({
        success: false,
        message: 'Not following this artist'
      });
    }

    user.followedArtists = user.followedArtists.filter(
      id => id.toString() !== artist._id.toString()
    );
    artist.followers = Math.max(0, artist.followers - 1);

    await user.save();
    await artist.save();

    res.json({
      success: true,
      message: 'Artist unfollowed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Search artists
// @route   GET /api/artists/search
// @access  Public
exports.searchArtists = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const artists = await Artist.find({
      name: { $regex: q, $options: 'i' }
    }).limit(50);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
