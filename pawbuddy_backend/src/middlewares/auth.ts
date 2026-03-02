import { Request, Response, NextFunction } from 'express';
import { createError } from './errorHandler.js';

// This is a placeholder auth middleware
// Implement JWT verification when you set it up

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
      throw createError('No authentication token provided', 401);
    }

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, env.JWT_SECRET);
    // req.user = decoded;

    // Placeholder for now
    console.log('🔒 Auth middleware - Token:', token);
    
    next();
  } catch (error) {
    next(createError('Invalid or expired token', 401));
  }
};

// Role-based authorization middleware
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
