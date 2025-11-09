const User = require('../models/User');
const EmailVerification = require('../models/EmailVerification');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const emailService = require('../services/emailService');
const crypto = require('crypto');

// @desc    Register new user with email verification
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user (email not verified yet)
    const user = await User.create({
      username,
      email,
      password,
      displayName,
      emailVerified: false
    });

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save verification token
    await EmailVerification.create({
      user: user._id,
      token: verificationToken
    });

    // Send verification email (non-blocking - don't fail registration if email fails)
    let emailSent = false;
    try {
      await emailService.sendVerificationEmail(email, verificationToken, displayName);
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError.message);
      // Continue with registration even if email fails
    }

    // Generate JWT token (but email needs to be verified to access most features)
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: emailSent
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful! Email verification is pending.',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profileImage: user.profileImage,
        role: user.role,
        isPremium: user.isPremium,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find verification record
    const verification = await EmailVerification.findOne({ token, verified: false });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Check if expired
    if (verification.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification token has expired'
      });
    }

    // Update user
    const user = await User.findById(verification.user);
    user.emailVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    // Mark verification as complete
    verification.verified = true;
    await verification.save();

    res.json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Private
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Delete old verification tokens
    await EmailVerification.deleteMany({ user: user._id });

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save verification token
    await EmailVerification.create({
      user: user._id,
      token: verificationToken
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken, user.displayName);

    res.json({
      success: true,
      message: 'Verification email sent!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Request OTP for login
// @route   POST /api/auth/request-otp
// @access  Public
exports.requestOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete old OTPs for this email
    await OTP.deleteMany({ email });

    // Save OTP
    await OTP.create({
      email,
      otp
    });

    // Send OTP email
    await emailService.sendOTPEmail(email, otp, user.displayName);

    res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login with OTP
// @route   POST /api/auth/login-otp
// @access  Public
exports.loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, used: false });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Check if expired
    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    // Get user
    const user = await User.findOne({ email });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profileImage: user.profileImage,
        role: user.role,
        isPremium: user.isPremium,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user (regular password login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user uses OAuth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `This account uses ${user.authProvider} login. Please use the ${user.authProvider} button to sign in.`
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        profileImage: user.profileImage,
        role: user.role,
        isPremium: user.isPremium,
        emailVerified: user.emailVerified
      },
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('likedSongs')
      .populate('playlists')
      .populate('followedArtists')
      .populate('artistProfile');

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

// @desc    Update user profile
// @route   PUT /api/auth/update-profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      displayName: req.body.displayName,
      profileImage: req.body.profileImage
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

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

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    // Check if user uses local auth
    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for OAuth accounts'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;
