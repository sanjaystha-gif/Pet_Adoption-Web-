import jwt, { SignOptions } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { env } from '../config/environment.js';
import { AuthPayload } from '../types/index.js';

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES,
  } as any);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES,
  } as any);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

/**
 * Compare password
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(password, hash);
};

/**
 * Hash token (for storing refresh tokens)
 */
export const hashToken = async (token: string): Promise<string> => {
  const salt = await bcryptjs.genSalt(5);
  return bcryptjs.hash(token, salt);
};

/**
 * Compare token
 */
export const compareToken = async (token: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(token, hash);
};
