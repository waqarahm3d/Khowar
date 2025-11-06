const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { protect, authorize } = require('../middleware/auth');

router.post('/share', protect, socialController.recordShare);
router.get('/song/:songId/shares', socialController.getSongShares);
router.get('/my-shares', protect, socialController.getMyShares);
router.get('/stats', protect, authorize('admin'), socialController.getSharingStats);

module.exports = router;
