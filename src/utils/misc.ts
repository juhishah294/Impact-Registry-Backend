import { scryptSync } from 'crypto';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

/**
 * Generate a unique reference ID
 */
export const generateReferenceId = (): string => {
  return uuidv4();
};

/**
 * Return a standardized success HTTP response
 */
export const returnSuccessHTTPResponse = (data: any = null, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Return a standardized error HTTP response
 */
export const returnErrorHTTPResponse = (message: string = 'Error', error: any = null) => {
  return {
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  };
};

/**
 * Hash a password using scrypt
 */
export const hashPassword = (password: string, salt?: string): string => {
  const passwordSalt = salt || process.env.PASSWORD_SALT || 'default-salt';
  return scryptSync(password, passwordSalt, 64).toString('hex');
};

/**
 * Verify a password against a hash
 */
export const verifyPassword = (password: string, hash: string, salt?: string): boolean => {
  const hashedPassword = hashPassword(password, salt);
  return hashedPassword === hash;
};

/**
 * Get enum value by key
 */
export const getEnumValue = (enumObject: any, key: string): any => {
  return enumObject[key] || null;
};

/**
 * Generate a random string of specified length
 */
export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize string input
 */
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Format date to ISO string
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Check if value is empty or null
 */
export const isEmpty = (value: any): boolean => {
  return value === null || value === undefined || value === '' || 
         (Array.isArray(value) && value.length === 0) ||
         (typeof value === 'object' && Object.keys(value).length === 0);
};

/**
 * Generate patient enrollment ID
 */
export const generatePatientEnrollmentId = (trialId: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${trialId}-${timestamp}-${random}`.toUpperCase();
};

/**
 * Generate trial protocol number
 */
export const generateTrialProtocolNumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substr(2, 8);
  return `TRIAL-${year}-${random}`.toUpperCase();
};

/**
 * Validate trial phase
 */
export const isValidTrialPhase = (phase: string): boolean => {
  const validPhases = ['PRECLINICAL', 'PHASE_I', 'PHASE_II', 'PHASE_III', 'PHASE_IV'];
  return validPhases.includes(phase);
};

/**
 * Generate adverse event report ID
 */
export const generateAdverseEventId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 6);
  return `AE-${timestamp}-${random}`.toUpperCase();
};

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Mask sensitive data for logging
 */
export const maskSensitiveData = (data: string, visibleChars: number = 4): string => {
  if (!data || data.length <= visibleChars) {
    return '*'.repeat(data?.length || 0);
  }
  
  const masked = '*'.repeat(data.length - visibleChars);
  return data.substring(0, visibleChars) + masked;
};

/**
 * Generate audit trail entry
 */
export const generateAuditEntry = (userId: string, action: string, resource: string, details?: any) => {
  return {
    id: generateReferenceId(),
    userId,
    action,
    resource,
    details: details || {},
    timestamp: new Date().toISOString(),
    ipAddress: null // Will be populated by middleware
  };
};
