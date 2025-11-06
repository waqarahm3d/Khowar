const multer = require('multer');
const storageService = require('../services/storageService');

// Use memory storage for cloud uploads
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  } else if (file.fieldname === 'image') {
    // Accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else {
    cb(null, true);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 50000000 // 50MB default
  },
  fileFilter: fileFilter
});

module.exports = upload;
