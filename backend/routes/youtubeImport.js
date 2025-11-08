const express = require('express');
const router = express.Router();
const youtubeImportController = require('../controllers/youtubeImportController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin or superAdmin role
router.use(protect);
router.use(authorize('admin', 'superAdmin'));

// Check if dependencies are installed
router.get('/check-dependencies', youtubeImportController.checkDependencies);

// Validate YouTube URL
router.post('/validate', youtubeImportController.validateUrl);

// Fetch metadata without downloading
router.post('/metadata', youtubeImportController.fetchMetadata);

// Get playlist/channel videos
router.post('/playlist-videos', youtubeImportController.getPlaylistVideos);

// Import single video
router.post('/import', youtubeImportController.importVideo);

// Get all import jobs
router.get('/jobs', youtubeImportController.getAllJobs);

// Get specific job status
router.get('/status/:jobId', youtubeImportController.getJobStatus);

// Cancel import job
router.delete('/cancel/:jobId', youtubeImportController.cancelJob);

module.exports = router;
