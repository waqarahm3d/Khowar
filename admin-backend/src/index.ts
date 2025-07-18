import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import musicRoutes from './routes/music';
import playlistRoutes from './routes/playlists';
import analyticsRoutes from './routes/analytics';
import storageRoutes from './routes/storage';
import adminRoutes from './routes/admin';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
}));

// CORS configuration with Pakistani cultural considerations
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'X-Cultural-Theme'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    message_urdu: 'اس IP سے بہت زیادہ درخواستیں',
  },
});

app.use(limiter);

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Pakistani Music App Backend is running',
    message_urdu: 'پاکستانی میوزک ایپ بیک اینڈ چل رہا ہے',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/playlists', authMiddleware, playlistRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/storage', authMiddleware, storageRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);

// Welcome endpoint with Pakistani cultural greeting
app.get('/', (req, res) => {
  const acceptLanguage = req.headers['accept-language'] || 'en';
  const isUrdu = acceptLanguage.includes('ur') || acceptLanguage.includes('urdu');
  
  res.json({
    message: isUrdu ? 'قوقنوز پورٹل میں خوش آمدید' : 'Welcome to Qoqnuz Portal',
    description: isUrdu 
      ? 'پاکستانی موسیقی کا بہترین پلیٹ فارم' 
      : 'The ultimate Pakistani music platform',
    features: [
      'High-quality music streaming',
      'Offline downloads',
      'Pakistani cultural themes',
      'Multi-cloud storage',
      'Admin dashboard',
    ],
    cultural_elements: {
      primary_colors: ['#01411C', '#FFFFFF'], // Pakistan flag colors
      accent_colors: ['#FF9933', '#FFD700'], // Saffron and gold
      supported_languages: ['urdu', 'english', 'punjabi', 'sindhi', 'pashto'],
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message_urdu: 'راستہ نہیں ملا',
    path: req.originalUrl,
  });
});

const PORT = config.port || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🎵 Pakistani Music App Backend running on port ${PORT}`);
  logger.info(`🇵🇰 Cultural themes and Urdu support enabled`);
  logger.info(`☁️  Multi-cloud storage integration ready`);
  logger.info(`🎨 Traditional Pakistani design elements loaded`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;