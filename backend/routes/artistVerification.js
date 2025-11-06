const express = require('express');
const router = express.Router();
const artistVerificationController = require('../controllers/artistVerificationController');
const { protect, authorize } = require('../middleware/auth');

// User routes
router.post('/apply', protect, artistVerificationController.applyForVerification);
router.get('/my-application', protect, artistVerificationController.getMyApplication);
router.get('/analytics', protect, artistVerificationController.getArtistAnalytics);
router.get('/stats', protect, artistVerificationController.getArtistStats);

// Admin routes
router.get('/applications', protect, authorize('admin'), artistVerificationController.getAllApplications);
router.put('/:id/review', protect, authorize('admin'), artistVerificationController.reviewApplication);

module.exports = router;
