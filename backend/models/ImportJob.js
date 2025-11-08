const mongoose = require('mongoose');

const importJobSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['single', 'playlist', 'channel'],
    default: 'single'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  progress: {
    total: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    currentStep: { type: String, default: 'Initializing...' }
  },
  metadata: {
    title: String,
    artist: String,
    thumbnail: String,
    duration: Number,
    description: String,
    tags: [String],
    uploader: String,
    uploadDate: String
  },
  result: {
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Song'
    },
    audioUrl: String,
    coverImage: String
  },
  error: {
    message: String,
    code: String,
    timestamp: Date,
    stack: String
  },
  settings: {
    audioFormat: { type: String, default: 'mp3' },
    audioQuality: { type: String, default: '320' },
    overrideArtist: String,
    overrideAlbum: String,
    overrideGenre: String,
    overrideTags: [String]
  }
}, {
  timestamps: true
});

// Index for querying jobs by admin and status
importJobSchema.index({ admin: 1, status: 1 });
importJobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ImportJob', importJobSchema);
