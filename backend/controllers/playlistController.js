const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

// @desc    Get public playlists
// @route   GET /api/playlists/public
// @access  Public
exports.getPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('owner', 'username displayName profileImage')
      .sort({ followers: -1 })
      .limit(50);

    res.json({
      success: true,
      data: playlists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's playlists
// @route   GET /api/playlists/my
// @access  Private
exports.getMyPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ owner: req.user._id })
      .populate('songs', 'title artist coverImage duration')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: playlists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public
exports.getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('owner', 'username displayName profileImage')
      .populate({
        path: 'songs',
        populate: {
          path: 'artist',
          select: 'name profileImage'
        }
      });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if playlist is private
    if (!playlist.isPublic && playlist.owner._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this playlist'
      });
    }

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create playlist
// @route   POST /api/playlists
// @access  Private
exports.createPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private
exports.updatePlaylist = async (req, res) => {
  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user owns the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist'
      });
    }

    playlist = await Playlist.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user owns the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this playlist'
      });
    }

    await playlist.deleteOne();

    res.json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user owns the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }

    const { songId } = req.body;

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Check if song already in playlist
    if (playlist.songs.includes(songId)) {
      return res.status(400).json({
        success: false,
        message: 'Song already in playlist'
      });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if user owns the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }

    playlist.songs = playlist.songs.filter(
      id => id.toString() !== req.params.songId
    );

    await playlist.save();

    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
