const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');

// @desc    Global search across songs, artists, and albums
// @route   GET /api/search?q=query
// @access  Public
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = q.trim();
    const searchRegex = new RegExp(searchQuery, 'i');

    // Search songs
    const songs = await Song.find({
      $or: [
        { title: searchRegex },
        { tags: searchRegex }
      ]
    })
      .populate('artist', 'name profileImage verified')
      .populate('album', 'title coverImage')
      .limit(10)
      .select('title artist album duration audioUrl coverImage playCount');

    // Search artists
    const artists = await Artist.find({
      $or: [
        { name: searchRegex },
        { bio: searchRegex },
        { genres: searchRegex }
      ]
    })
      .limit(10)
      .select('name profileImage coverImage bio verified followers');

    // Search albums
    const albums = await Album.find({
      $or: [
        { title: searchRegex },
        { genre: searchRegex }
      ]
    })
      .populate('artist', 'name profileImage verified')
      .limit(10)
      .select('title artist coverImage releaseYear trackCount');

    res.json({
      success: true,
      data: {
        songs,
        artists,
        albums,
        query: searchQuery
      },
      counts: {
        songs: songs.length,
        artists: artists.length,
        albums: albums.length,
        total: songs.length + artists.length + albums.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
