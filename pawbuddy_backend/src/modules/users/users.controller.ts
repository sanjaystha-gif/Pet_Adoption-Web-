import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.js';
import { User } from '../../models/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';
import { createError } from '../../middlewares/errorHandler.js';
import { updateProfileSchema, UpdateProfileRequest } from './users.validator.js';

/**
 * Update current user's profile
 * PATCH /api/users/me
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      sendError(res, 'Authentication required', undefined, 401);
      return;
    }

    // Validate request body
    let validatedData: UpdateProfileRequest;
    try {
      validatedData = updateProfileSchema.parse(req.body);
    } catch (error: any) {
      const message = error.errors?.[0]?.message || 'Invalid request data';
      sendError(res, message, undefined, 400);
      return;
    }

    // Find user by authenticated user ID (from JWT token)
    const user = await User.findById(req.user.userId);

    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    // Update only provided fields (partial update)
    if (validatedData.name !== undefined) {
      user.name = validatedData.name;
    }
    if (validatedData.phone !== undefined) {
      user.phone = validatedData.phone || undefined;
    }
    if (validatedData.city !== undefined) {
      user.city = validatedData.city || undefined;
    }
    if (validatedData.bio !== undefined) {
      user.bio = validatedData.bio || undefined;
    }
    if (validatedData.avatar !== undefined) {
      user.avatar = validatedData.avatar || undefined;
    }

    // Save updated user
    await user.save();

    // Return updated user data (excluding sensitive fields)
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
      phone: user.phone || null,
      city: user.city || null,
      bio: user.bio || null,
      joinedDate: user.joinedDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    sendSuccess(res, userResponse, 'Profile updated successfully', 200);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', undefined, 500);
  }
};

/**
 * Get current user's profile
 * GET /api/users/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Ensure user is authenticated
    if (!req.user) {
      sendError(res, 'Authentication required', undefined, 401);
      return;
    }

    // Find user by authenticated user ID (from JWT token)
    const user = await User.findById(req.user.userId);

    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    // Return user data (excluding sensitive fields)
    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || null,
      phone: user.phone || null,
      city: user.city || null,
      bio: user.bio || null,
      joinedDate: user.joinedDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    sendSuccess(res, userResponse, 'User retrieved successfully', 200);
  } catch (error) {
    console.error('Get current user error:', error);
    sendError(res, 'Failed to retrieve user', undefined, 500);
  }
};
