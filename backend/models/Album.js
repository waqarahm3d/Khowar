const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required']
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  genre: [{
    type: String
  }],
  type: {
    type: String,
    enum: ['album', 'single', 'ep'],
    default: 'album'
  },
  totalTracks: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0
  },
  label: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for songs
albumSchema.virtual('songs', {
  ref: 'Song',
  localField: '_id',
  foreignField: 'album'
});

module.exports = mongoose.model('Album', albumSchema);
