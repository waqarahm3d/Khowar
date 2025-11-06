const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');
const { protect } = require('../middleware/auth');

router.get('/public', playlistController.getPublicPlaylists);
router.get('/my', protect, playlistController.getMyPlaylists);
router.get('/:id', playlistController.getPlaylist);

router.post('/', protect, playlistController.createPlaylist);
router.put('/:id', protect, playlistController.updatePlaylist);
router.delete('/:id', protect, playlistController.deletePlaylist);

router.post('/:id/songs', protect, playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, playlistController.removeSongFromPlaylist);

module.exports = router;
