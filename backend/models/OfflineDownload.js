const mongoose = require('mongoose');

const offlineDownloadSchema = new mongoose.Schema({
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
  encryptionKey: {
    type: String,
    required: true
  },
  downloadToken: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  lastPlayedAt: {
    type: Date
  },
  playCount: {
    type: Number,
    default: 0
  },
  deviceId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for auto-deletion of expired downloads
offlineDownloadSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
offlineDownloadSchema.index({ user: 1, song: 1 });

module.exports = mongoose.model('OfflineDownload', offlineDownloadSchema);
