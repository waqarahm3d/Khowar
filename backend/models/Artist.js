const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    unique: true
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/1200x400'
  },
  genres: [{
    type: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  followers: {
    type: Number,
    default: 0
  },
  monthlyListeners: {
    type: Number,
    default: 0
  },
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String,
    youtube: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for albums
artistSchema.virtual('albums', {
  ref: 'Album',
  localField: '_id',
  foreignField: 'artist'
});

// Virtual populate for songs
artistSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'artist'
});

module.exports = mongoose.model('Artist', artistSchema);
