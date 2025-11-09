const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const PlayHistory = require('../models/PlayHistory');

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalArtists = await Artist.countDocuments();
    const totalAlbums = await Album.countDocuments();
    const totalPlaylists = await Playlist.countDocuments();
    const totalPlays = await PlayHistory.countDocuments();

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get most played songs
    const topSongs = await Song.find()
      .populate('artist', 'name')
      .sort({ playCount: -1 })
      .limit(10);

    // Get most followed artists
    const topArtists = await Artist.find()
      .sort({ followers: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalSongs,
          totalArtists,
          totalAlbums,
          totalPlaylists,
          totalPlays,
          recentUsers
        },
        topSongs,
        topArtists
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, displayName, role, isPremium, profileImage } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      displayName,
      role: role || 'user',
      isPremium: isPremium || false,
      profileImage: profileImage || 'https://via.placeholder.com/150',
      emailVerified: true, // Admin-created users are auto-verified
      authProvider: 'local'
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Change user password
// @route   PUT /api/admin/users/:id/password
// @access  Private/Admin
exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload audio file
// @route   POST /api/admin/upload/audio
// @access  Private/Admin
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file'
      });
    }

    const audioUrl = `/uploads/audio/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        audioUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload image file
// @route   POST /api/admin/upload/image
// @access  Private/Admin
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    const imageUrl = `/uploads/images/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        imageUrl,
        filename: req.file.filename,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get environment settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    // Return current environment variables (excluding sensitive data in raw form)
    const settings = {
      // Storage
      STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || 'local',
      UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
      MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '50000000',

      // AWS S3
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '***' : '',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '***' : '',
      AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
      AWS_REGION: process.env.AWS_REGION || 'us-east-1',

      // Wasabi
      WASABI_ACCESS_KEY_ID: process.env.WASABI_ACCESS_KEY_ID ? '***' : '',
      WASABI_SECRET_ACCESS_KEY: process.env.WASABI_SECRET_ACCESS_KEY ? '***' : '',
      WASABI_BUCKET_NAME: process.env.WASABI_BUCKET_NAME || '',
      WASABI_REGION: process.env.WASABI_REGION || 'us-east-1',
      WASABI_ENDPOINT: process.env.WASABI_ENDPOINT || 'https://s3.us-east-1.wasabisys.com',

      // Backblaze B2
      BACKBLAZE_KEY_ID: process.env.BACKBLAZE_KEY_ID ? '***' : '',
      BACKBLAZE_APPLICATION_KEY: process.env.BACKBLAZE_APPLICATION_KEY ? '***' : '',
      BACKBLAZE_BUCKET_NAME: process.env.BACKBLAZE_BUCKET_NAME || '',
      BACKBLAZE_REGION: process.env.BACKBLAZE_REGION || 'us-west-000',
      BACKBLAZE_ENDPOINT: process.env.BACKBLAZE_ENDPOINT || 'https://s3.us-west-000.backblazeb2.com',

      // Cloudflare R2
      CLOUDFLARE_ACCESS_KEY_ID: process.env.CLOUDFLARE_ACCESS_KEY_ID ? '***' : '',
      CLOUDFLARE_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_SECRET_ACCESS_KEY ? '***' : '',
      CLOUDFLARE_BUCKET_NAME: process.env.CLOUDFLARE_BUCKET_NAME || '',
      CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID || '',
      CLOUDFLARE_ENDPOINT: process.env.CLOUDFLARE_ENDPOINT || '',

      // Email
      EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
      EMAIL_PORT: process.env.EMAIL_PORT || '587',
      EMAIL_SECURE: process.env.EMAIL_SECURE || 'false',
      EMAIL_USER: process.env.EMAIL_USER || '',
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '***' : '',
      EMAIL_FROM: process.env.EMAIL_FROM || '',

      // OAuth
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '***' : '',
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '',
      FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
      FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET ? '***' : '',
      FACEBOOK_CALLBACK_URL: process.env.FACEBOOK_CALLBACK_URL || '',

      // App Settings
      CLIENT_URL: process.env.CLIENT_URL || '',
      ADMIN_URL: process.env.ADMIN_URL || '',
      NODE_ENV: process.env.NODE_ENV || 'production',
      JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update environment settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env');

    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Parse existing .env into object
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          envVars[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    // Update with new values (skip *** masked values)
    Object.keys(req.body).forEach(key => {
      const value = req.body[key];
      // Only update if value is not the mask and not empty
      if (value && value !== '***') {
        envVars[key] = value;
      }
    });

    // Build new .env content
    let newEnvContent = '# Environment Configuration\n';
    newEnvContent += '# Generated by Voice of Chitral Admin Panel\n\n';

    // Group variables by category
    const categories = {
      'Server Configuration': ['NODE_ENV', 'PORT'],
      'Database': ['MONGODB_URI'],
      'JWT Secret': ['JWT_SECRET', 'JWT_EXPIRE', 'SESSION_SECRET'],
      'File Upload': ['UPLOAD_PATH', 'MAX_FILE_SIZE', 'STORAGE_PROVIDER'],
      'AWS S3': ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME', 'AWS_REGION'],
      'Wasabi S3': ['WASABI_ACCESS_KEY_ID', 'WASABI_SECRET_ACCESS_KEY', 'WASABI_BUCKET_NAME', 'WASABI_REGION', 'WASABI_ENDPOINT'],
      'Backblaze B2': ['BACKBLAZE_KEY_ID', 'BACKBLAZE_APPLICATION_KEY', 'BACKBLAZE_BUCKET_NAME', 'BACKBLAZE_REGION', 'BACKBLAZE_ENDPOINT'],
      'Cloudflare R2': ['CLOUDFLARE_ACCESS_KEY_ID', 'CLOUDFLARE_SECRET_ACCESS_KEY', 'CLOUDFLARE_BUCKET_NAME', 'CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_ENDPOINT'],
      'Email Configuration': ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_SECURE', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'],
      'OAuth': ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_CALLBACK_URL', 'FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET', 'FACEBOOK_CALLBACK_URL'],
      'Client URLs': ['CLIENT_URL', 'ADMIN_URL'],
    };

    Object.keys(categories).forEach(category => {
      newEnvContent += `# ${category}\n`;
      categories[category].forEach(key => {
        if (envVars[key]) {
          newEnvContent += `${key}=${envVars[key]}\n`;
        }
      });
      newEnvContent += '\n';
    });

    // Write back to .env file
    fs.writeFileSync(envPath, newEnvContent, 'utf8');

    res.json({
      success: true,
      message: 'Settings updated successfully. Backend will restart automatically in 3 seconds...',
      data: {
        updated: Object.keys(req.body).length
      }
    });

    // Auto-restart backend after 3 seconds (gives time for response to be sent)
    setTimeout(() => {
      try {
        const { exec } = require('child_process');
        exec('pm2 restart voice-of-chitral-backend', (error, stdout, stderr) => {
          if (error) {
            console.error('Auto-restart failed:', error);
            console.log('Please manually restart with: pm2 restart voice-of-chitral-backend');
          } else {
            console.log('✅ Backend restarted automatically');
            console.log(stdout);
          }
        });
      } catch (error) {
        console.error('Auto-restart error:', error.message);
      }
    }, 3000);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
