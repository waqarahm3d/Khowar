const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class StorageService {
  constructor() {
    this.provider = process.env.STORAGE_PROVIDER || 'local';
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'aws':
        this.client = this.createS3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        });
        this.bucket = process.env.AWS_BUCKET_NAME;
        break;

      case 'wasabi':
        this.client = this.createS3Client({
          region: process.env.WASABI_REGION,
          endpoint: process.env.WASABI_ENDPOINT,
          credentials: {
            accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
            secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY,
          }
        });
        this.bucket = process.env.WASABI_BUCKET_NAME;
        break;

      case 'backblaze':
        this.client = this.createS3Client({
          region: process.env.BACKBLAZE_REGION,
          endpoint: process.env.BACKBLAZE_ENDPOINT,
          credentials: {
            accessKeyId: process.env.BACKBLAZE_KEY_ID,
            secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY,
          }
        });
        this.bucket = process.env.BACKBLAZE_BUCKET_NAME;
        break;

      case 'cloudflare':
        this.client = this.createS3Client({
          region: 'auto',
          endpoint: process.env.CLOUDFLARE_ENDPOINT,
          credentials: {
            accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
            secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
          }
        });
        this.bucket = process.env.CLOUDFLARE_BUCKET_NAME;
        break;

      case 'local':
      default:
        this.client = null;
        this.bucket = null;
        break;
    }
  }

  createS3Client(config) {
    return new S3Client(config);
  }

  /**
   * Upload file to storage
   */
  async upload(file, folder = 'audio') {
    if (this.provider === 'local') {
      return this.uploadLocal(file, folder);
    }

    const key = `${folder}/${uuidv4()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    try {
      await this.client.send(command);
      const url = this.getPublicUrl(key);

      // If Bunny CDN is enabled, return CDN URL
      if (process.env.BUNNY_CDN_ENABLED === 'true') {
        return this.getBunnyCDNUrl(key);
      }

      return url;
    } catch (error) {
      console.error('Storage upload error:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  /**
   * Upload to Bunny CDN Storage
   */
  async uploadToBunnyCDN(file, folder = 'audio') {
    const filename = `${folder}/${uuidv4()}-${file.originalname}`;
    const storageZone = process.env.BUNNY_STORAGE_ZONE;
    const apiKey = process.env.BUNNY_STORAGE_PASSWORD;

    const url = `https://storage.bunnycdn.com/${storageZone}/${filename}`;

    try {
      await axios.put(url, file.buffer, {
        headers: {
          'AccessKey': apiKey,
          'Content-Type': file.mimetype,
        }
      });

      return this.getBunnyCDNUrl(filename);
    } catch (error) {
      console.error('Bunny CDN upload error:', error);
      throw new Error('Failed to upload to Bunny CDN');
    }
  }

  /**
   * Delete file from storage
   */
  async delete(key) {
    if (this.provider === 'local') {
      return this.deleteLocal(key);
    }

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Storage delete error:', error);
      throw new Error('Failed to delete file from storage');
    }
  }

  /**
   * Get public URL for file
   */
  getPublicUrl(key) {
    switch (this.provider) {
      case 'aws':
        return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      case 'wasabi':
        return `https://${this.bucket}.s3.${process.env.WASABI_REGION}.wasabisys.com/${key}`;

      case 'backblaze':
        return `https://${this.bucket}.s3.${process.env.BACKBLAZE_REGION}.backblazeb2.com/${key}`;

      case 'cloudflare':
        return `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${this.bucket}/${key}`;

      case 'local':
      default:
        return `/uploads/${key}`;
    }
  }

  /**
   * Get Bunny CDN URL
   */
  getBunnyCDNUrl(key) {
    const cdnUrl = process.env.BUNNY_CDN_URL;
    return `${cdnUrl}/${key}`;
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(key, expiresIn = 3600) {
    if (this.provider === 'local') {
      return this.getPublicUrl(key);
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      const url = await getSignedUrl(this.client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('Get signed URL error:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Upload local file (fallback)
   */
  uploadLocal(file, folder) {
    const filename = `${uuidv4()}-${file.originalname}`;
    return `/uploads/${folder}/${filename}`;
  }

  /**
   * Delete local file
   */
  deleteLocal(key) {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', key);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return true;
  }

  /**
   * Get storage provider info
   */
  getInfo() {
    return {
      provider: this.provider,
      bucket: this.bucket,
      bunnyCDNEnabled: process.env.BUNNY_CDN_ENABLED === 'true',
    };
  }
}

module.exports = new StorageService();
