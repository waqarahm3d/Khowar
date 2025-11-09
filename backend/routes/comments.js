const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Comment routes
router.get('/:id/replies', commentController.getReplies);
router.put('/:id', protect, commentController.updateComment);
router.delete('/:id', protect, commentController.deleteComment);
router.post('/:id/like', protect, commentController.likeComment);
router.delete('/:id/like', protect, commentController.unlikeComment);

module.exports = router;
