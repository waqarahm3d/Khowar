import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Storage } from '@google-cloud/storage';
import { config } from '../config/config';
import { logger } from '../utils/logger';

export interface StorageFile {
  key: string;
  url?: string;
  size?: number;
  contentType?: string;
  metadata?: Record<string, any>;
}

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, any>;
  tags?: Record<string, string>;
  acl?: 'private' | 'public-read';
}

export interface StorageProvider {
  upload(file: Buffer, key: string, options?: UploadOptions): Promise<StorageFile>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
  getMetadata(key: string): Promise<Record<string, any>>;
}

// AWS S3 Provider
class S3Provider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: config.storage.aws.region,
      credentials: {
        accessKeyId: config.storage.aws.accessKeyId!,
        secretAccessKey: config.storage.aws.secretAccessKey!,
      },
    });
    this.bucket = config.storage.aws.bucket;
  }

  async upload(file: Buffer, key: string, options?: UploadOptions): Promise<StorageFile> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: options?.contentType || 'application/octet-stream',
        Metadata: options?.metadata || {},
        Tagging: options?.tags ? Object.entries(options.tags).map(([k, v]) => `${k}=${v}`).join('&') : undefined,
        ACL: options?.acl || 'private',
      });

      await this.client.send(command);
      
      const url = await this.getSignedUrl(key);
      
      return {
        key,
        url,
        size: file.length,
        contentType: options?.contentType,
        metadata: options?.metadata,
      };
    } catch (error) {
      logger.error('S3 upload failed:', error);
      throw new Error(`S3 upload failed: ${error}`);
    }
  }

  async download(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      const chunks: Uint8Array[] = [];
      
      if (response.Body) {
        const stream = response.Body as any;
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('S3 download failed:', error);
      throw new Error(`S3 download failed: ${error}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      logger.error('S3 delete failed:', error);
      throw new Error(`S3 delete failed: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      logger.error('S3 signed URL generation failed:', error);
      throw new Error(`S3 signed URL generation failed: ${error}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getMetadata(key: string): Promise<Record<string, any>> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      return response.Metadata || {};
    } catch (error) {
      logger.error('S3 metadata retrieval failed:', error);
      throw new Error(`S3 metadata retrieval failed: ${error}`);
    }
  }
}

// Wasabi Provider (S3 Compatible)
class WasabiProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: config.storage.wasabi.region,
      endpoint: config.storage.wasabi.endpoint,
      credentials: {
        accessKeyId: config.storage.wasabi.accessKeyId!,
        secretAccessKey: config.storage.wasabi.secretAccessKey!,
      },
    });
    this.bucket = config.storage.wasabi.bucket;
  }

  async upload(file: Buffer, key: string, options?: UploadOptions): Promise<StorageFile> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: options?.contentType || 'application/octet-stream',
        Metadata: options?.metadata || {},
        ACL: options?.acl || 'private',
      });

      await this.client.send(command);
      
      const url = await this.getSignedUrl(key);
      
      return {
        key,
        url,
        size: file.length,
        contentType: options?.contentType,
        metadata: options?.metadata,
      };
    } catch (error) {
      logger.error('Wasabi upload failed:', error);
      throw new Error(`Wasabi upload failed: ${error}`);
    }
  }

  async download(key: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      const chunks: Uint8Array[] = [];
      
      if (response.Body) {
        const stream = response.Body as any;
        for await (const chunk of stream) {
          chunks.push(chunk);
        }
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('Wasabi download failed:', error);
      throw new Error(`Wasabi download failed: ${error}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
    } catch (error) {
      logger.error('Wasabi delete failed:', error);
      throw new Error(`Wasabi delete failed: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await getSignedUrl(this.client, command, { expiresIn });
    } catch (error) {
      logger.error('Wasabi signed URL generation failed:', error);
      throw new Error(`Wasabi signed URL generation failed: ${error}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getMetadata(key: string): Promise<Record<string, any>> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const response = await this.client.send(command);
      return response.Metadata || {};
    } catch (error) {
      logger.error('Wasabi metadata retrieval failed:', error);
      throw new Error(`Wasabi metadata retrieval failed: ${error}`);
    }
  }
}

// Google Drive Provider (simplified implementation)
class GoogleDriveProvider implements StorageProvider {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });
    this.bucketName = process.env.GOOGLE_CLOUD_BUCKET || 'pakistani-music-app';
  }

  async upload(file: Buffer, key: string, options?: UploadOptions): Promise<StorageFile> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const fileObj = bucket.file(key);
      
      await fileObj.save(file, {
        metadata: {
          contentType: options?.contentType || 'application/octet-stream',
          metadata: options?.metadata || {},
        },
      });

      const url = await this.getSignedUrl(key);
      
      return {
        key,
        url,
        size: file.length,
        contentType: options?.contentType,
        metadata: options?.metadata,
      };
    } catch (error) {
      logger.error('Google Drive upload failed:', error);
      throw new Error(`Google Drive upload failed: ${error}`);
    }
  }

  async download(key: string): Promise<Buffer> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      
      const [contents] = await file.download();
      return contents;
    } catch (error) {
      logger.error('Google Drive download failed:', error);
      throw new Error(`Google Drive download failed: ${error}`);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      
      await file.delete();
    } catch (error) {
      logger.error('Google Drive delete failed:', error);
      throw new Error(`Google Drive delete failed: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      
      const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresIn * 1000,
      });
      
      return url;
    } catch (error) {
      logger.error('Google Drive signed URL generation failed:', error);
      throw new Error(`Google Drive signed URL generation failed: ${error}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      
      const [exists] = await file.exists();
      return exists;
    } catch (error) {
      return false;
    }
  }

  async getMetadata(key: string): Promise<Record<string, any>> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(key);
      
      const [metadata] = await file.getMetadata();
      return metadata.metadata || {};
    } catch (error) {
      logger.error('Google Drive metadata retrieval failed:', error);
      throw new Error(`Google Drive metadata retrieval failed: ${error}`);
    }
  }
}

// Backblaze B2 Provider (simplified - would need B2 SDK)
class BackblazeProvider implements StorageProvider {
  constructor() {
    // Note: This is a simplified implementation
    // In a real app, you would use the official B2 SDK
    logger.warn('Backblaze B2 provider is not fully implemented');
  }

  async upload(file: Buffer, key: string, options?: UploadOptions): Promise<StorageFile> {
    throw new Error('Backblaze B2 provider not implemented');
  }

  async download(key: string): Promise<Buffer> {
    throw new Error('Backblaze B2 provider not implemented');
  }

  async delete(key: string): Promise<void> {
    throw new Error('Backblaze B2 provider not implemented');
  }

  async getSignedUrl(key: string, expiresIn?: number): Promise<string> {
    throw new Error('Backblaze B2 provider not implemented');
  }

  async exists(key: string): Promise<boolean> {
    throw new Error('Backblaze B2 provider not implemented');
  }

  async getMetadata(key: string): Promise<Record<string, any>> {
    throw new Error('Backblaze B2 provider not implemented');
  }
}

// Main Cloud Storage Service
export class CloudStorageService {
  private providers: Map<string, StorageProvider> = new Map();
  private defaultProvider: string;

  constructor() {
    this.defaultProvider = config.storage.defaultProvider;
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize AWS S3
    if (config.storage.aws.accessKeyId && config.storage.aws.secretAccessKey) {
      this.providers.set('aws', new S3Provider());
      logger.info('✅ AWS S3 provider initialized');
    }

    // Initialize Wasabi
    if (config.storage.wasabi.accessKeyId && config.storage.wasabi.secretAccessKey) {
      this.providers.set('wasabi', new WasabiProvider());
      logger.info('✅ Wasabi provider initialized');
    }

    // Initialize Google Drive
    if (config.storage.googleDrive.clientId && config.storage.googleDrive.clientSecret) {
      this.providers.set('gdrive', new GoogleDriveProvider());
      logger.info('✅ Google Drive provider initialized');
    }

    // Initialize Backblaze (placeholder)
    if (config.storage.backblaze.keyId && config.storage.backblaze.applicationKey) {
      this.providers.set('backblaze', new BackblazeProvider());
      logger.info('⚠️  Backblaze provider initialized (not fully implemented)');
    }

    if (this.providers.size === 0) {
      logger.warn('⚠️  No cloud storage providers configured');
    }
  }

  private getProvider(providerName?: string): StorageProvider {
    const provider = providerName || this.defaultProvider;
    const storageProvider = this.providers.get(provider);
    
    if (!storageProvider) {
      throw new Error(`Storage provider '${provider}' not available`);
    }
    
    return storageProvider;
  }

  async upload(file: Buffer, key: string, options?: UploadOptions & { provider?: string }): Promise<StorageFile> {
    const provider = this.getProvider(options?.provider);
    
    // Add Pakistani music app specific metadata
    const enhancedOptions = {
      ...options,
      metadata: {
        ...options?.metadata,
        uploadedBy: 'pakistani-music-app',
        uploadedAt: new Date().toISOString(),
        culturalContext: 'pakistani-music',
      },
    };

    return await provider.upload(file, key, enhancedOptions);
  }

  async download(key: string, provider?: string): Promise<Buffer> {
    const storageProvider = this.getProvider(provider);
    return await storageProvider.download(key);
  }

  async delete(key: string, provider?: string): Promise<void> {
    const storageProvider = this.getProvider(provider);
    return await storageProvider.delete(key);
  }

  async getSignedUrl(key: string, expiresIn: number = 3600, provider?: string): Promise<string> {
    const storageProvider = this.getProvider(provider);
    return await storageProvider.getSignedUrl(key, expiresIn);
  }

  async exists(key: string, provider?: string): Promise<boolean> {
    const storageProvider = this.getProvider(provider);
    return await storageProvider.exists(key);
  }

  async getMetadata(key: string, provider?: string): Promise<Record<string, any>> {
    const storageProvider = this.getProvider(provider);
    return await storageProvider.getMetadata(key);
  }

  // Multi-provider operations
  async uploadToMultipleProviders(file: Buffer, key: string, providers: string[], options?: UploadOptions): Promise<StorageFile[]> {
    const results: StorageFile[] = [];
    
    for (const provider of providers) {
      try {
        const result = await this.upload(file, key, { ...options, provider });
        results.push(result);
        logger.info(`✅ File uploaded to ${provider}: ${key}`);
      } catch (error) {
        logger.error(`❌ Failed to upload to ${provider}: ${error}`);
      }
    }
    
    return results;
  }

  async syncBetweenProviders(key: string, fromProvider: string, toProvider: string): Promise<void> {
    try {
      const file = await this.download(key, fromProvider);
      const metadata = await this.getMetadata(key, fromProvider);
      
      await this.upload(file, key, { 
        provider: toProvider, 
        metadata: { ...metadata, syncedFrom: fromProvider } 
      });
      
      logger.info(`✅ File synced from ${fromProvider} to ${toProvider}: ${key}`);
    } catch (error) {
      logger.error(`❌ Failed to sync file between providers: ${error}`);
      throw error;
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getDefaultProvider(): string {
    return this.defaultProvider;
  }
}

// Singleton instance
export const cloudStorageService = new CloudStorageService();