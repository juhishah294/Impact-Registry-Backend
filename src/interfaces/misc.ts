export interface HTTPResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  statusCode?: number;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => NodeJS.ReadableStream;
}

export interface S3UploadResult {
  key: string;
  location: string;
  bucket: string;
  etag: string;
}

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  type?: string;
}

export interface AuditLog {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startsWith' | 'endsWith';
  value: any;
}

export interface SearchQuery {
  filters?: SearchFilter[];
  search?: string;
  pagination?: PaginationInput;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export interface CacheOptions {
  ttl?: number;
  key: string;
  tags?: string[];
}

export interface QueueMessage {
  id: string;
  type: string;
  payload: any;
  priority?: number;
  delay?: number;
  attempts?: number;
  maxAttempts?: number;
}

export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface ReferenceIdOptions {
  prefix?: string;
  length?: number;
  includeTimestamp?: boolean;
}
