const mongoose = require('mongoose');

const featuredContentSchema = new mongoose.Schema({
  contentType: {
    type: String,
    enum: ['song', 'album', 'playlist', 'artist', 'banner'],
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'contentModel',
    required: true
  },
  contentModel: {
    type: String,
    required: true,
    enum: ['Song', 'Album', 'Playlist', 'Artist']
  },
  section: {
    type: String,
    enum: ['hero', 'trending', 'new_releases', 'recommended', 'top_charts', 'featured_artists'],
    required: true
  },
  priority: {
    type: Number,
    default: 0
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  customImage: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  clickCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
featuredContentSchema.index({ section: 1, priority: -1, isActive: 1 });

module.exports = mongoose.model('FeaturedContent', featuredContentSchema);
