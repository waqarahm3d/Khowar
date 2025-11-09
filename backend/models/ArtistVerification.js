const mongoose = require('mongoose');

const artistVerificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  realName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  genre: [{
    type: String
  }],
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String,
    youtube: String,
    spotify: String,
    website: String
  },
  verificationDocuments: [{
    type: String, // URLs to uploaded documents
    description: String
  }],
  previousReleases: [{
    title: String,
    link: String,
    platform: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'needs_info'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewNotes: {
    type: String
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ArtistVerification', artistVerificationSchema);
