const mongoose = require('mongoose');

const socialShareSchema = new mongoose.Schema({
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
  platform: {
    type: String,
    enum: ['facebook', 'twitter', 'whatsapp', 'instagram', 'telegram', 'other'],
    required: true
  },
  sharedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for analytics
socialShareSchema.index({ song: 1, platform: 1 });
socialShareSchema.index({ user: 1, sharedAt: -1 });

module.exports = mongoose.model('SocialShare', socialShareSchema);
