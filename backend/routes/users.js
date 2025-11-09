const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/liked-songs', protect, userController.getLikedSongs);
router.get('/play-history', protect, userController.getPlayHistory);
router.get('/followed-artists', protect, userController.getFollowedArtists);

module.exports = router;
