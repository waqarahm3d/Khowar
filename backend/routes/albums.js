const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', albumController.getAllAlbums);
router.get('/search', albumController.searchAlbums);
router.get('/:id', albumController.getAlbum);
router.get('/:id/songs', albumController.getAlbumSongs);

// Admin routes
router.post('/', protect, authorize('admin'), albumController.createAlbum);
router.put('/:id', protect, authorize('admin'), albumController.updateAlbum);
router.delete('/:id', protect, authorize('admin'), albumController.deleteAlbum);

module.exports = router;
