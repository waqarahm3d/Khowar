const Comment = require('../models/Comment');
const Song = require('../models/Song');
const Filter = require('bad-words');

const filter = new Filter();

// @desc    Get comments for a song
// @route   GET /api/songs/:songId/comments
// @access  Public
exports.getComments = async (req, res) => {
  try {
    const { songId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      song: songId,
      parentComment: null,
      isHidden: false
    })
      .populate('user', 'username displayName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
          isHidden: false
        })
          .populate('user', 'username displayName profileImage')
          .sort({ createdAt: 1 })
          .limit(5);

        return {
          ...comment.toObject(),
          replies,
          replyCount: await Comment.countDocuments({ parentComment: comment._id, isHidden: false })
        };
      })
    );

    const total = await Comment.countDocuments({
      song: songId,
      parentComment: null,
      isHidden: false
    });

    res.json({
      success: true,
      data: commentsWithReplies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a comment
// @route   POST /api/songs/:songId/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { songId } = req.params;
    const { content, parentComment } = req.body;

    // Check if song exists
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    // Check content length
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be less than 500 characters'
      });
    }

    // Check for profanity
    if (filter.isProfane(content)) {
      return res.status(400).json({
        success: false,
        message: 'Your comment contains inappropriate language. Please revise and try again.'
      });
    }

    // If it's a reply, check if parent comment exists
    if (parentComment) {
      const parentCommentExists = await Comment.findById(parentComment);
      if (!parentCommentExists) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    // Create comment
    const comment = await Comment.create({
      user: req.user._id,
      song: songId,
      content: content.trim(),
      parentComment: parentComment || null
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username displayName profileImage');

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    // Check content length
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty'
      });
    }

    if (content.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be less than 500 characters'
      });
    }

    // Check for profanity
    if (filter.isProfane(content)) {
      return res.status(400).json({
        success: false,
        message: 'Your comment contains inappropriate language. Please revise and try again.'
      });
    }

    comment.content = content.trim();
    comment.isEdited = true;
    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username displayName profileImage');

    res.json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Delete the comment
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like a comment
// @route   POST /api/comments/:id/like
// @access  Private
exports.likeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user already liked the comment
    if (comment.likedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this comment'
      });
    }

    comment.likedBy.push(req.user._id);
    comment.likes += 1;
    await comment.save();

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unlike a comment
// @route   DELETE /api/comments/:id/like
// @access  Private
exports.unlikeComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if user has liked the comment
    if (!comment.likedBy.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have not liked this comment'
      });
    }

    comment.likedBy = comment.likedBy.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    comment.likes = Math.max(0, comment.likes - 1);
    await comment.save();

    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get replies for a comment
// @route   GET /api/comments/:id/replies
// @access  Public
exports.getReplies = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const replies = await Comment.find({
      parentComment: id,
      isHidden: false
    })
      .populate('user', 'username displayName profileImage')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({
      parentComment: id,
      isHidden: false
    });

    res.json({
      success: true,
      data: replies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
