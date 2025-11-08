const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All routes require admin role
router.use(protect, authorize('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.put('/users/:id/password', adminController.changePassword);
router.delete('/users/:id', adminController.deleteUser);

// File upload
router.post('/upload/audio', upload.single('audio'), adminController.uploadAudio);
router.post('/upload/image', upload.single('image'), adminController.uploadImage);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
