const mongoose = require('mongoose');

const artistAnalyticsSchema = new mongoose.Schema({
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
    unique: true
  },
  totalPlays: {
    type: Number,
    default: 0
  },
  totalLikes: {
    type: Number,
    default: 0
  },
  totalComments: {
    type: Number,
    default: 0
  },
  totalShares: {
    type: Number,
    default: 0
  },
  monthlyListeners: {
    type: Number,
    default: 0
  },
  topCountries: [{
    country: String,
    listeners: Number
  }],
  playsByDate: [{
    date: Date,
    plays: Number
  }],
  demographics: {
    ageRanges: [{
      range: String, // "18-24", "25-34", etc.
      percentage: Number
    }],
    genderSplit: {
      male: Number,
      female: Number,
      other: Number
    }
  },
  revenueData: {
    totalRevenue: {
      type: Number,
      default: 0
    },
    monthlyRevenue: [{
      month: Date,
      amount: Number
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ArtistAnalytics', artistAnalyticsSchema);
