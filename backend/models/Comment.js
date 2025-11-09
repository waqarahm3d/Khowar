const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  hiddenReason: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
commentSchema.index({ song: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

module.exports = mongoose.model('Comment', commentSchema);
