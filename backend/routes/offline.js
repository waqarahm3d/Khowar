const express = require('express');
const router = express.Router();
const offlineController = require('../controllers/offlineController');
const { protect } = require('../middleware/auth');

router.post('/download', protect, offlineController.requestDownload);
router.get('/download/:token', protect, offlineController.downloadSong);
router.get('/my-downloads', protect, offlineController.getMyDownloads);
router.post('/verify-playback', protect, offlineController.verifyPlayback);
router.delete('/download/:id', protect, offlineController.deleteDownload);

module.exports = router;
