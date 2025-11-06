const express = require('express');
const router = express.Router();
const landingPageController = require('../controllers/landingPageController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', landingPageController.getLandingPage);
router.post('/featured/:id/click', landingPageController.recordClick);

// Admin routes
router.post('/featured', protect, authorize('admin'), landingPageController.createFeaturedContent);
router.get('/featured/all', protect, authorize('admin'), landingPageController.getAllFeaturedContent);
router.put('/featured/:id', protect, authorize('admin'), landingPageController.updateFeaturedContent);
router.delete('/featured/:id', protect, authorize('admin'), landingPageController.deleteFeaturedContent);
router.post('/featured/reorder', protect, authorize('admin'), landingPageController.reorderFeaturedContent);

module.exports = router;
