const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required']
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  genre: [{
    type: String
  }],
  releaseDate: {
    type: Date,
    default: Date.now
  },
  lyrics: {
    type: String,
    default: ''
  },
  playCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  trackNumber: {
    type: Number
  },
  featuredArtists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  // YouTube import fields
  youtubeUrl: {
    type: String
  },
  imported: {
    type: Boolean,
    default: false
  },
  importDate: {
    type: Date
  },
  tags: [{
    type: String
  }],
  releaseYear: {
    type: Number
  }
}, {
  timestamps: true
});

// Index for search
songSchema.index({ title: 'text', lyrics: 'text' });

module.exports = mongoose.model('Song', songSchema);
