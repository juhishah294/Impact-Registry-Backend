import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { logger } from './logger';

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
  provinceId?: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  userId: string;
  tokenVersion: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this-in-production';

export const generateAccessToken = (payload: Omit<TokenPayload, 'iat' | 'exp'>): string => {
  try {
    return sign(payload, JWT_SECRET, { expiresIn: '15m' });
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
};

export const generateRefreshToken = (payload: Omit<RefreshTokenPayload, 'iat' | 'exp'>): string => {
  try {
    return sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Error verifying access token:', error);
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    const decoded = verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Error verifying refresh token:', error);
    throw new Error('Invalid or expired refresh token');
  }
};

export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

export const decodeTokenWithoutVerification = (token: string): TokenPayload | null => {
  try {
    const decoded = verify(token, JWT_SECRET, { ignoreExpiration: true }) as TokenPayload;
    return decoded;
  } catch (error) {
    logger.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    verify(token, JWT_SECRET);
    return false;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return true;
    }
    return true;
  }
};

export const getTokenExpirationTime = (token: string): number | null => {
  const decoded = decodeTokenWithoutVerification(token);
  return decoded?.exp || null;
};

// Simple token generation function for compatibility
export const generateToken = (payload: { userId: string; email: string; role: string }): string => {
  return generateAccessToken(payload);
};
