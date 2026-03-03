import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import { User } from '../../models/index.js';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response.js';

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize as string) || 10);
    const search = req.query.q as string | undefined;
    const role = req.query.role as string | undefined;
    const skip = (page - 1) * pageSize;

    const filter: any = {};

    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by role
    if (role && ['admin', 'adopter'].includes(role)) {
      filter.role = role;
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ joinedDate: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      User.countDocuments(filter),
    ]);

    const transformedUsers = users.map((user: any) => ({
      ...user,
      id: user._id.toString(),
      joinedDate: user.joinedDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      _id: undefined,
      __v: undefined,
    }));

    sendPaginated(
      res,
      transformedUsers,
      { page, pageSize, total },
      'Users retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Get all users error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schema = z.object({
      role: z.enum(['admin', 'adopter']),
    });

    const body = schema.parse(req.body);

    const user = await User.findByIdAndUpdate(id, { role: body.role }, { new: true }).lean();

    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    const transformedUser = {
      ...user,
      id: user._id.toString(),
      joinedDate: user.joinedDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedUser, 'User role updated successfully', 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Update user role error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Update user profile (self)
 */
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const schema = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().optional(),
      bio: z.string().optional(),
      city: z.string().optional(),
      avatar: z.string().url().optional(),
    });

    const body = schema.parse(req.body);

    const user = await User.findByIdAndUpdate(req.user.userId, body, { new: true }).lean();

    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    const transformedUser = {
      ...user,
      id: user._id.toString(),
      joinedDate: user.joinedDate.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedUser, 'Profile updated successfully', 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Update profile error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};
