const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

const execPromise = promisify(exec);

class YouTubeImportService {
  constructor() {
    this.tempDir = path.join(__dirname, '../uploads/temp/youtube-imports');
    this.maxFileSize = process.env.YOUTUBE_IMPORT_MAX_SIZE || 100; // MB
    this.audioQuality = process.env.YOUTUBE_IMPORT_AUDIO_QUALITY || '320'; // kbps

    // Ensure temp directory exists
    this.ensureTempDir();
  }

  async ensureTempDir() {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create temp directory:', error);
    }
  }

  /**
   * Validate YouTube URL
   */
  validateUrl(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  }

  /**
   * Get video type (single, playlist, channel)
   */
  getUrlType(url) {
    if (url.includes('playlist?list=')) return 'playlist';
    if (url.includes('/@') || url.includes('/channel/') || url.includes('/c/')) return 'channel';
    return 'single';
  }

  /**
   * Extract video ID from URL
   */
  extractVideoId(url) {
    const match = url.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/);
    return match ? match[1] : null;
  }

  /**
   * Fetch metadata using yt-dlp
   */
  async fetchMetadata(url) {
    try {
      const command = `yt-dlp --dump-json --no-playlist "${url}"`;
      const { stdout, stderr } = await execPromise(command, {
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      if (stderr && !stdout) {
        throw new Error(stderr);
      }

      const metadata = JSON.parse(stdout);

      return this.parseMetadata(metadata);
    } catch (error) {
      throw new Error(`Failed to fetch metadata: ${error.message}`);
    }
  }

  /**
   * Parse and clean metadata
   */
  parseMetadata(rawMetadata) {
    // Extract artist and title from video title
    const { artist, title } = this.parseTitle(rawMetadata.title);

    return {
      id: rawMetadata.id,
      title: title || rawMetadata.title,
      artist: artist || rawMetadata.uploader || 'Unknown Artist',
      thumbnail: rawMetadata.thumbnail,
      duration: rawMetadata.duration,
      description: rawMetadata.description,
      tags: rawMetadata.tags || [],
      uploader: rawMetadata.uploader,
      uploadDate: rawMetadata.upload_date,
      webpage_url: rawMetadata.webpage_url,
      formats: rawMetadata.formats
    };
  }

  /**
   * Parse title to extract artist and song title
   * Common patterns:
   * - "Artist - Title"
   * - "Artist: Title"
   * - "Title by Artist"
   * - "Title (Official Audio)"
   * - "Title ft. Artist"
   */
  parseTitle(fullTitle) {
    let artist = null;
    let title = fullTitle;

    // Remove common suffixes
    title = title
      .replace(/\s*\(official\s*(audio|video|music\s*video)\)/gi, '')
      .replace(/\s*\[official\s*(audio|video|music\s*video)\]/gi, '')
      .replace(/\s*\|\s*official\s*(audio|video)/gi, '')
      .trim();

    // Pattern 1: "Artist - Title"
    if (title.includes(' - ')) {
      const parts = title.split(' - ');
      if (parts.length === 2) {
        artist = parts[0].trim();
        title = parts[1].trim();
        return { artist, title };
      }
    }

    // Pattern 2: "Artist: Title"
    if (title.includes(': ')) {
      const parts = title.split(': ');
      if (parts.length === 2) {
        artist = parts[0].trim();
        title = parts[1].trim();
        return { artist, title };
      }
    }

    // Pattern 3: "Title by Artist"
    const byMatch = title.match(/^(.+?)\s+by\s+(.+)$/i);
    if (byMatch) {
      title = byMatch[1].trim();
      artist = byMatch[2].trim();
      return { artist, title };
    }

    // Pattern 4: "Title ft. Artist" or "Title feat. Artist"
    const ftMatch = title.match(/^(.+?)\s+(ft\.|feat\.|featuring)\s+(.+)$/i);
    if (ftMatch) {
      title = ftMatch[1].trim();
      artist = ftMatch[3].trim();
      return { artist, title };
    }

    return { artist, title };
  }

  /**
   * Download audio from YouTube
   */
  async downloadAudio(url, jobId, progressCallback) {
    const filename = `${jobId}_${crypto.randomBytes(8).toString('hex')}`;
    const outputPath = path.join(this.tempDir, filename);

    try {
      // Update progress
      if (progressCallback) {
        await progressCallback('Downloading audio from YouTube...', 10);
      }

      // yt-dlp command to download best audio
      const command = `yt-dlp -x --audio-format mp3 --audio-quality ${this.audioQuality}K \
        --no-playlist \
        --max-filesize ${this.maxFileSize}M \
        -o "${outputPath}.%(ext)s" \
        "${url}"`;

      await execPromise(command, {
        maxBuffer: 1024 * 1024 * 50 // 50MB buffer
      });

      if (progressCallback) {
        await progressCallback('Audio downloaded successfully', 50);
      }

      // Find the downloaded file
      const files = await fs.readdir(this.tempDir);
      const downloadedFile = files.find(f => f.startsWith(filename));

      if (!downloadedFile) {
        throw new Error('Downloaded file not found');
      }

      return path.join(this.tempDir, downloadedFile);
    } catch (error) {
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  /**
   * Download thumbnail
   */
  async downloadThumbnail(thumbnailUrl, jobId) {
    const filename = `${jobId}_thumbnail_${crypto.randomBytes(8).toString('hex')}.jpg`;
    const outputPath = path.join(this.tempDir, filename);

    try {
      // Use yt-dlp to download thumbnail or curl as fallback
      const command = `curl -L "${thumbnailUrl}" -o "${outputPath}"`;
      await execPromise(command);

      return outputPath;
    } catch (error) {
      console.error('Failed to download thumbnail:', error);
      return null;
    }
  }

  /**
   * Move file to final destination
   */
  async moveToFinalDestination(tempPath, destinationDir, newFilename) {
    try {
      await fs.mkdir(destinationDir, { recursive: true });

      const ext = path.extname(tempPath);
      const finalPath = path.join(destinationDir, `${newFilename}${ext}`);

      await fs.rename(tempPath, finalPath);

      return finalPath;
    } catch (error) {
      throw new Error(`Failed to move file: ${error.message}`);
    }
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles(jobId) {
    try {
      const files = await fs.readdir(this.tempDir);
      const jobFiles = files.filter(f => f.startsWith(jobId));

      for (const file of jobFiles) {
        await fs.unlink(path.join(this.tempDir, file));
      }
    } catch (error) {
      console.error('Failed to cleanup temp files:', error);
    }
  }

  /**
   * Get playlist/channel videos
   */
  async getPlaylistVideos(url) {
    try {
      const command = `yt-dlp --flat-playlist --dump-json "${url}"`;
      const { stdout } = await execPromise(command, {
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });

      // Parse JSONL output (one JSON per line)
      const lines = stdout.trim().split('\n');
      const videos = lines.map(line => {
        try {
          const data = JSON.parse(line);
          return {
            id: data.id,
            title: data.title,
            url: `https://youtube.com/watch?v=${data.id}`,
            duration: data.duration,
            thumbnail: `https://i.ytimg.com/vi/${data.id}/hqdefault.jpg`
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      return videos;
    } catch (error) {
      throw new Error(`Failed to get playlist videos: ${error.message}`);
    }
  }

  /**
   * Check if yt-dlp is installed
   */
  async checkDependencies() {
    try {
      await execPromise('yt-dlp --version');
      await execPromise('ffmpeg -version');
      return { ytdlp: true, ffmpeg: true };
    } catch (error) {
      const hasYtDlp = !error.message.includes('yt-dlp');
      const hasFFmpeg = !error.message.includes('ffmpeg');
      return { ytdlp: hasYtDlp, ffmpeg: hasFFmpeg };
    }
  }
}

module.exports = new YouTubeImportService();
