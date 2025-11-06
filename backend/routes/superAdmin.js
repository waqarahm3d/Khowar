const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect, authorize('admin'));

router.put('/users/:id/toggle-status', superAdminController.toggleUserStatus);
router.put('/users/:id/change-password', superAdminController.changeUserPassword);
router.get('/users/:id/profile', superAdminController.getUserProfile);
router.put('/users/:id/role', superAdminController.updateUserRole);
router.put('/users/:id/premium', superAdminController.togglePremium);
router.get('/users/search', superAdminController.searchUsers);
router.post('/users/bulk-update', superAdminController.bulkUpdateUsers);

module.exports = router;
