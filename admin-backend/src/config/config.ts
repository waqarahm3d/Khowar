import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/pakistani_music_app',
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-pakistani-music-app',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  },
  
  // File upload configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '50000000', 10), // 50MB
    allowedMimeTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/flac',
      'audio/aac',
      'audio/ogg',
      'audio/m4a',
      'image/jpeg',
      'image/png',
      'image/webp',
    ],
  },
  
  // Cloud storage configuration
  storage: {
    // AWS S3
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_S3_BUCKET || 'pakistani-music-app',
    },
    
    // Wasabi (S3 compatible)
    wasabi: {
      accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
      secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
      region: process.env.WASABI_REGION || 'us-east-1',
      bucket: process.env.WASABI_BUCKET || 'pakistani-music-app',
      endpoint: process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com',
    },
    
    // Backblaze B2
    backblaze: {
      keyId: process.env.BACKBLAZE_KEY_ID,
      applicationKey: process.env.BACKBLAZE_APPLICATION_KEY,
      bucketId: process.env.BACKBLAZE_BUCKET_ID,
      bucketName: process.env.BACKBLAZE_BUCKET_NAME || 'pakistani-music-app',
    },
    
    // Google Drive
    googleDrive: {
      clientId: process.env.GOOGLE_DRIVE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_DRIVE_REDIRECT_URI,
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
    },
    
    // Default storage provider
    defaultProvider: process.env.DEFAULT_STORAGE_PROVIDER || 'aws',
  },
  
  // Email configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
    from: process.env.EMAIL_FROM || 'noreply@qoqnuz.com',
  },
  
  // Pakistani cultural configuration
  cultural: {
    defaultLanguage: process.env.DEFAULT_LANGUAGE || 'urdu',
    supportedLanguages: ['urdu', 'english', 'punjabi', 'sindhi', 'pashto'],
    defaultTheme: process.env.DEFAULT_THEME || 'pakistan-green',
    themes: {
      'pakistan-green': {
        primary: '#01411C',
        secondary: '#FFFFFF',
        accent: '#FF9933',
        gold: '#FFD700',
      },
      'saffron-gold': {
        primary: '#FF9933',
        secondary: '#FFD700',
        accent: '#01411C',
        gold: '#FFFFFF',
      },
      'cultural-blue': {
        primary: '#1E3A8A',
        secondary: '#FFFFFF',
        accent: '#FF9933',
        gold: '#FFD700',
      },
    },
    fonts: {
      urdu: ['Noto Nastaliq Urdu', 'Jameel Noori Nastaliq'],
      english: ['Inter', 'SF Pro Display'],
      arabic: ['Amiri', 'Scheherazade'],
    },
  },
  
  // Analytics configuration
  analytics: {
    enabled: process.env.ANALYTICS_ENABLED === 'true',
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    mixpanelToken: process.env.MIXPANEL_TOKEN,
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
  },
  
  // Feature flags
  features: {
    socialLogin: process.env.FEATURE_SOCIAL_LOGIN === 'true',
    offlineMode: process.env.FEATURE_OFFLINE_MODE === 'true',
    culturalThemes: process.env.FEATURE_CULTURAL_THEMES !== 'false', // enabled by default
    multiLanguage: process.env.FEATURE_MULTI_LANGUAGE !== 'false', // enabled by default
    premiumFeatures: process.env.FEATURE_PREMIUM === 'true',
  },
  
  // External API keys
  externalApis: {
    lastFm: {
      apiKey: process.env.LASTFM_API_KEY,
      secret: process.env.LASTFM_SECRET,
    },
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    musicBrainz: {
      userAgent: process.env.MUSICBRAINZ_USER_AGENT || 'PakistaniMusicApp/1.0.0',
    },
  },
};

// Validation function
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Validate at least one storage provider is configured
  const hasStorageProvider = 
    config.storage.aws.accessKeyId ||
    config.storage.wasabi.accessKeyId ||
    config.storage.backblaze.keyId ||
    config.storage.googleDrive.clientId;
    
  if (!hasStorageProvider) {
    console.warn('⚠️  No cloud storage provider configured. File uploads will be stored locally.');
  }
};

export default config;