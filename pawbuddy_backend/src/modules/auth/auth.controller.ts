import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import { User, RefreshToken } from '../../models/index.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  hashToken,
  compareToken,
  verifyRefreshToken,
} from '../../utils/auth.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { createError } from '../../middlewares/errorHandler.js';
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth.validator.js';
import { env } from '../../config/environment.js';

/**
 * Register a new user
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const body = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      sendError(res, 'User already exists with this email', undefined, 400);
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      joinedDate: new Date(),
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());
    const hashedRefreshToken = await hashToken(refreshToken);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user._id.toString(),
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Register error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Login user
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const body = loginSchema.parse(req.body);

    // Find user by email
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', undefined, 401);
      return;
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(body.password, user.password);
    if (!isPasswordCorrect) {
      sendError(res, 'Invalid email or password', undefined, 401);
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken(user._id.toString());
    const hashedRefreshToken = await hashToken(refreshToken);

    // Save refresh token to database
    await RefreshToken.create({
      userId: user._id.toString(),
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    sendSuccess(
      res,
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
      'Login successful',
      200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Login error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const body = refreshTokenSchema.parse(req.body);

    // Verify refresh token
    let decoded;
    try {
      decoded = verifyRefreshToken(body.refreshToken);
    } catch (error) {
      sendError(res, 'Invalid refresh token', undefined, 401);
      return;
    }

    // Find refresh token in database
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
    }).select('+token');

    if (!storedToken) {
      sendError(res, 'Refresh token not found or expired', undefined, 401);
      return;
    }

    // Compare token
    const isTokenValid = await compareToken(body.refreshToken, storedToken.token);
    if (!isTokenValid) {
      sendError(res, 'Invalid refresh token', undefined, 401);
      return;
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken(user._id.toString());
    const hashedNewRefreshToken = await hashToken(newRefreshToken);

    // Delete old refresh token and save new one
    await RefreshToken.deleteOne({ _id: storedToken._id });
    await RefreshToken.create({
      userId: user._id.toString(),
      token: hashedNewRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    sendSuccess(
      res,
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      'Token refreshed successfully',
      200
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Refresh token error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Logout user (revoke refresh token)
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    // Delete all refresh tokens for this user
    await RefreshToken.deleteMany({ userId: req.user.userId });

    sendSuccess(res, null, 'Logout successful', 200);
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Get current user profile
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    sendSuccess(res, user, 'User profile retrieved', 200);
  } catch (error) {
    console.error('Get me error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};
