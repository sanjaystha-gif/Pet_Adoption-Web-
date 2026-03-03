import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';
import { verifyAccessToken } from '../utils/auth.js';
import { AuthPayload } from '../types/index.js';

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

/**
 * Authenticate using JWT access token
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw createError('No authentication token provided', 401);
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      throw createError('Invalid or expired token', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(createError('Authentication required', 401));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(createError('Insufficient permissions', 403));
      return;
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    next(createError('Authentication required', 401));
    return;
  }

  if (req.user.role !== 'admin') {
    next(createError('Admin access required', 403));
    return;
  }

  next();
};

/**
 * Optional authentication (doesn't require auth, but sets user if token provided)
 */
export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch (error) {
        // Ignore invalid token, just don't set user
      }
    }
    next();
  } catch (error) {
    next();
  }
};
