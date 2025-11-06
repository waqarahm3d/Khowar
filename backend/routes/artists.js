const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', artistController.getAllArtists);
router.get('/search', artistController.searchArtists);
router.get('/:id', optionalAuth, artistController.getArtist);
router.get('/:id/songs', artistController.getArtistSongs);
router.get('/:id/albums', artistController.getArtistAlbums);

// Protected routes
router.post('/:id/follow', protect, artistController.followArtist);
router.delete('/:id/follow', protect, artistController.unfollowArtist);

// Admin routes
router.post('/', protect, authorize('admin'), artistController.createArtist);
router.put('/:id', protect, authorize('admin'), artistController.updateArtist);
router.delete('/:id', protect, authorize('admin'), artistController.deleteArtist);

module.exports = router;
