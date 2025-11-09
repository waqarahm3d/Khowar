const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const commentController = require('../controllers/commentController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, songController.getAllSongs);
router.get('/search', optionalAuth, songController.searchSongs);
router.get('/trending', optionalAuth, songController.getTrendingSongs);
router.get('/recent', optionalAuth, songController.getRecentSongs);
router.get('/:id', optionalAuth, songController.getSong);
router.get('/:id/stream', songController.streamSong);

// Comment routes for songs
router.get('/:songId/comments', commentController.getComments);
router.post('/:songId/comments', protect, commentController.createComment);

// Protected routes
router.post('/:id/like', protect, songController.likeSong);
router.delete('/:id/like', protect, songController.unlikeSong);
router.post('/:id/play', optionalAuth, songController.recordPlay); // Allow guests to play

// Admin routes
router.post('/', protect, authorize('admin'), songController.createSong);
router.put('/:id', protect, authorize('admin'), songController.updateSong);
router.delete('/:id', protect, authorize('admin'), songController.deleteSong);

module.exports = router;
