import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger';

// Configure AWS S3 Client (v3)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_S3_BUCKET_STATIC_FILES_BUCKET_KEY || process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_S3_SECRET_KEY_ID_STATIC_FILES || process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export interface FileUploadResult {
  fileName: string;
  originalFileName: string;
  s3Key: string;
  s3Url: string;
  cloudFrontUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface FileUploadOptions {
  patientId: string;
  instituteId: string;
  documentType: string;
  originalFileName: string;
  fileBuffer: Buffer;
  mimeType: string;
}

export class S3FileStorageService {
  private bucketName: string;
  private cloudFrontDomain: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'schell-static-files';
    this.cloudFrontDomain = process.env.AWS_S3_BUCKET_URL || process.env.CLOUDFRONT_DOMAIN || '';

    if (!this.cloudFrontDomain) {
      logger.warn('CLOUDFRONT_DOMAIN not set, using S3 direct URLs');
    }
  }

  /**
   * Upload consent document to S3
   */
  async uploadConsentDocument(options: FileUploadOptions): Promise<FileUploadResult> {
    try {
      const { patientId, instituteId, documentType, originalFileName, fileBuffer, mimeType } = options;

      // Validate file type
      this.validateFileType(mimeType, originalFileName);

      // Validate file size (max 10MB)
      this.validateFileSize(fileBuffer.length);

      // Generate unique filename and S3 key
      const fileExtension = this.getFileExtension(originalFileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const s3Key = this.generateS3Key(instituteId, patientId, documentType, uniqueFileName);

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        Body: fileBuffer,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
        Metadata: {
          'original-filename': originalFileName,
          'patient-id': patientId,
          'institute-id': instituteId,
          'document-type': documentType,
          'upload-date': new Date().toISOString(),
        },
      });

      await s3Client.send(uploadCommand);

      // Generate URLs
      const s3Url = `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;
      const cloudFrontUrl = this.generateCloudFrontUrl(s3Key);

      logger.info(`File uploaded successfully to S3: ${s3Key}`);

      return {
        fileName: uniqueFileName,
        originalFileName,
        s3Key,
        s3Url,
        cloudFrontUrl,
        fileSize: fileBuffer.length,
        mimeType,
      };

    } catch (error) {
      logger.error('Error uploading file to S3:', error);
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate signed URL for secure file access
   */
  async generateSignedUrl(s3Key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;

    } catch (error) {
      logger.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(s3Key: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });

      await s3Client.send(command);
      logger.info(`File deleted from S3: ${s3Key}`);
      return true;

    } catch (error) {
      logger.error('Error deleting file from S3:', error);
      return false;
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(s3Key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });
      await s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(s3Key: string): Promise<any | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
      });
      const result = await s3Client.send(command);
      return result;
    } catch (error) {
      logger.error('Error getting file metadata:', error);
      return null;
    }
  }

  /**
   * Generate organized S3 key structure
   */
  private generateS3Key(instituteId: string, patientId: string, documentType: string, fileName: string): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    // Structure: consents/{year}/{month}/{instituteId}/{patientId}/{documentType}/{fileName}
    return `consents/${year}/${month}/${instituteId}/${patientId}/${documentType}/${fileName}`;
  }

  /**
   * Generate CloudFront URL
   */
  private generateCloudFrontUrl(s3Key: string): string {
    if (!this.cloudFrontDomain) {
      return `https://${this.bucketName}.s3.amazonaws.com/${s3Key}`;
    }
    return `https://${this.cloudFrontDomain}/${s3Key}`;
  }

  /**
   * Validate file type (PDF, images only)
   */
  private validateFileType(mimeType: string, fileName: string): void {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/tiff',
    ];

    const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif'];

    const fileExtension = this.getFileExtension(fileName).toLowerCase();

    if (!allowedMimeTypes.includes(mimeType.toLowerCase()) ||
      !allowedExtensions.includes(fileExtension)) {
      throw new Error(`Invalid file type. Allowed types: PDF, JPEG, PNG, GIF, BMP, TIFF. Got: ${mimeType}`);
    }
  }

  /**
   * Validate file size (max 10MB)
   */
  private validateFileSize(fileSize: number): void {
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    if (fileSize > maxSizeBytes) {
      throw new Error(`File size too large. Maximum allowed: 10MB. Got: ${(fileSize / 1024 / 1024).toFixed(2)}MB`);
    }

    if (fileSize === 0) {
      throw new Error('File is empty');
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(lastDotIndex) : '';
  }

  /**
   * Generate pre-signed URL for direct upload (optional for frontend direct upload)
   */
  async generatePresignedUploadUrl(s3Key: string, mimeType: string, expiresIn: number = 300): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: s3Key,
        ContentType: mimeType,
        ServerSideEncryption: 'AES256',
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
      return signedUrl;

    } catch (error) {
      logger.error('Error generating presigned upload URL:', error);
      throw new Error('Failed to generate presigned upload URL');
    }
  }
}

export const s3FileStorage = new S3FileStorageService();
