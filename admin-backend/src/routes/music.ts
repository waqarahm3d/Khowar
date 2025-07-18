import { Router } from 'express';
import multer from 'multer';
import { body, param, query } from 'express-validator';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';
import { validateRequest } from '../middleware/validateRequest';
import { MusicController } from '../controllers/MusicController';
import { config } from '../config/config';

const router = Router();
const musicController = new MusicController();

// Multer configuration for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio and image files are allowed.'));
    }
  },
});

// Public routes (no authentication required)

// Get all songs with pagination and filtering
router.get(
  '/songs',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('genre').optional().isString(),
    query('language').optional().isIn(['urdu', 'english', 'punjabi', 'sindhi', 'pashto']),
    query('culturalTags').optional().isString(),
    query('mood').optional().isString(),
    query('search').optional().isString(),
    query('sortBy').optional().isIn(['createdAt', 'title', 'playCount', 'downloadCount']),
    query('sortOrder').optional().isIn(['asc', 'desc']),
  ],
  validateRequest,
  musicController.getAllSongs
);

// Get song by ID
router.get(
  '/songs/:id',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.getSongById
);

// Stream song (get signed URL)
router.get(
  '/songs/:id/stream',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.streamSong
);

// Get song lyrics
router.get(
  '/songs/:id/lyrics',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.getSongLyrics
);

// Get artists
router.get(
  '/artists',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('genre').optional().isString(),
    query('origin').optional().isString(),
  ],
  validateRequest,
  musicController.getAllArtists
);

// Get artist by ID
router.get(
  '/artists/:id',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.getArtistById
);

// Get artist songs
router.get(
  '/artists/:id/songs',
  [
    param('id').isString().notEmpty(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  musicController.getArtistSongs
);

// Get albums
router.get(
  '/albums',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().isString(),
    query('genre').optional().isString(),
    query('language').optional().isString(),
  ],
  validateRequest,
  musicController.getAllAlbums
);

// Get album by ID
router.get(
  '/albums/:id',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.getAlbumById
);

// Get album songs
router.get(
  '/albums/:id/songs',
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.getAlbumSongs
);

// Cultural and festival-based endpoints
router.get(
  '/cultural/featured',
  musicController.getFeaturedCulturalContent
);

router.get(
  '/cultural/festivals',
  musicController.getFestivalContent
);

router.get(
  '/cultural/genres',
  musicController.getPakistaniGenres
);

router.get(
  '/cultural/moods',
  musicController.getCulturalMoods
);

// Search endpoints
router.get(
  '/search',
  [
    query('q').isString().isLength({ min: 1 }),
    query('type').optional().isIn(['songs', 'artists', 'albums', 'all']),
    query('language').optional().isString(),
    query('genre').optional().isString(),
  ],
  validateRequest,
  musicController.searchMusic
);

// Protected routes (authentication required)

// User favorites
router.get(
  '/favorites',
  authMiddleware,
  musicController.getUserFavorites
);

router.post(
  '/favorites/:songId',
  authMiddleware,
  [param('songId').isString().notEmpty()],
  validateRequest,
  musicController.addToFavorites
);

router.delete(
  '/favorites/:songId',
  authMiddleware,
  [param('songId').isString().notEmpty()],
  validateRequest,
  musicController.removeFromFavorites
);

// User downloads
router.get(
  '/downloads',
  authMiddleware,
  musicController.getUserDownloads
);

router.post(
  '/downloads/:songId',
  authMiddleware,
  [param('songId').isString().notEmpty()],
  validateRequest,
  musicController.initiateDownload
);

router.get(
  '/downloads/:songId/url',
  authMiddleware,
  [param('songId').isString().notEmpty()],
  validateRequest,
  musicController.getDownloadUrl
);

// Recently played
router.get(
  '/recent',
  authMiddleware,
  musicController.getRecentlyPlayed
);

router.post(
  '/recent/:songId',
  authMiddleware,
  [param('songId').isString().notEmpty()],
  validateRequest,
  musicController.addToRecentlyPlayed
);

// Admin routes (admin authentication required)

// Upload music
router.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  [
    body('title').isString().isLength({ min: 1 }),
    body('titleUrdu').optional().isString(),
    body('titleLocal').optional().isString(),
    body('artistId').isString().notEmpty(),
    body('albumId').optional().isString(),
    body('genre').optional().isString(),
    body('language').optional().isIn(['urdu', 'english', 'punjabi', 'sindhi', 'pashto']),
    body('culturalTags').optional().isArray(),
    body('mood').optional().isString(),
    body('occasion').optional().isArray(),
    body('lyrics').optional().isString(),
    body('lyricsUrdu').optional().isString(),
    body('storageProvider').optional().isIn(['aws', 'wasabi', 'backblaze', 'gdrive']),
  ],
  validateRequest,
  musicController.uploadSong
);

// Update song
router.put(
  '/songs/:id',
  authMiddleware,
  adminMiddleware,
  [
    param('id').isString().notEmpty(),
    body('title').optional().isString(),
    body('titleUrdu').optional().isString(),
    body('titleLocal').optional().isString(),
    body('genre').optional().isString(),
    body('language').optional().isIn(['urdu', 'english', 'punjabi', 'sindhi', 'pashto']),
    body('culturalTags').optional().isArray(),
    body('mood').optional().isString(),
    body('occasion').optional().isArray(),
    body('lyrics').optional().isString(),
    body('lyricsUrdu').optional().isString(),
    body('isActive').optional().isBoolean(),
  ],
  validateRequest,
  musicController.updateSong
);

// Delete song
router.delete(
  '/songs/:id',
  authMiddleware,
  adminMiddleware,
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.deleteSong
);

// Create artist
router.post(
  '/artists',
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  [
    body('name').isString().isLength({ min: 1 }),
    body('nameUrdu').optional().isString(),
    body('nameLocal').optional().isString(),
    body('bio').optional().isString(),
    body('bioUrdu').optional().isString(),
    body('origin').optional().isString(),
    body('genres').optional().isArray(),
    body('languages').optional().isArray(),
    body('socialLinks').optional().isObject(),
  ],
  validateRequest,
  musicController.createArtist
);

// Update artist
router.put(
  '/artists/:id',
  authMiddleware,
  adminMiddleware,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  [
    param('id').isString().notEmpty(),
    body('name').optional().isString(),
    body('nameUrdu').optional().isString(),
    body('nameLocal').optional().isString(),
    body('bio').optional().isString(),
    body('bioUrdu').optional().isString(),
    body('origin').optional().isString(),
    body('genres').optional().isArray(),
    body('languages').optional().isArray(),
    body('socialLinks').optional().isObject(),
    body('isActive').optional().isBoolean(),
  ],
  validateRequest,
  musicController.updateArtist
);

// Delete artist
router.delete(
  '/artists/:id',
  authMiddleware,
  adminMiddleware,
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.deleteArtist
);

// Create album
router.post(
  '/albums',
  authMiddleware,
  adminMiddleware,
  upload.single('coverImage'),
  [
    body('title').isString().isLength({ min: 1 }),
    body('titleUrdu').optional().isString(),
    body('titleLocal').optional().isString(),
    body('artistId').isString().notEmpty(),
    body('description').optional().isString(),
    body('releaseDate').optional().isISO8601(),
    body('genre').optional().isString(),
    body('language').optional().isIn(['urdu', 'english', 'punjabi', 'sindhi', 'pashto']),
    body('recordLabel').optional().isString(),
    body('culturalTags').optional().isArray(),
    body('festivalTags').optional().isArray(),
  ],
  validateRequest,
  musicController.createAlbum
);

// Update album
router.put(
  '/albums/:id',
  authMiddleware,
  adminMiddleware,
  upload.single('coverImage'),
  [
    param('id').isString().notEmpty(),
    body('title').optional().isString(),
    body('titleUrdu').optional().isString(),
    body('titleLocal').optional().isString(),
    body('description').optional().isString(),
    body('releaseDate').optional().isISO8601(),
    body('genre').optional().isString(),
    body('language').optional().isIn(['urdu', 'english', 'punjabi', 'sindhi', 'pashto']),
    body('recordLabel').optional().isString(),
    body('culturalTags').optional().isArray(),
    body('festivalTags').optional().isArray(),
    body('isActive').optional().isBoolean(),
  ],
  validateRequest,
  musicController.updateAlbum
);

// Delete album
router.delete(
  '/albums/:id',
  authMiddleware,
  adminMiddleware,
  [param('id').isString().notEmpty()],
  validateRequest,
  musicController.deleteAlbum
);

// Bulk operations
router.post(
  '/bulk/upload',
  authMiddleware,
  adminMiddleware,
  upload.array('files', 50),
  musicController.bulkUpload
);

router.post(
  '/bulk/update-cultural-tags',
  authMiddleware,
  adminMiddleware,
  [
    body('songIds').isArray().notEmpty(),
    body('culturalTags').isArray(),
    body('action').isIn(['add', 'remove', 'replace']),
  ],
  validateRequest,
  musicController.bulkUpdateCulturalTags
);

// Analytics endpoints
router.get(
  '/analytics/popular',
  [
    query('period').optional().isIn(['day', 'week', 'month', 'year']),
    query('genre').optional().isString(),
    query('language').optional().isString(),
  ],
  validateRequest,
  musicController.getPopularSongs
);

router.get(
  '/analytics/trending',
  [
    query('period').optional().isIn(['day', 'week', 'month']),
    query('region').optional().isString(),
  ],
  validateRequest,
  musicController.getTrendingSongs
);

// Cultural events integration
router.get(
  '/events/current',
  musicController.getCurrentCulturalEvents
);

router.get(
  '/events/:eventId/playlist',
  [param('eventId').isString().notEmpty()],
  validateRequest,
  musicController.getEventPlaylist
);

export default router;