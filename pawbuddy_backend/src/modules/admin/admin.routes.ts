import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllUsers,
  updateUserRole,
  updateProfile,
  getDashboardStats,
} from './admin.controller.js';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);

// Dashboard stats (admin only)
router.get('/stats', requireAdmin, getDashboardStats);

// User management (admin only)
router.get('/users', requireAdmin, getAllUsers);
router.patch('/users/:id/role', requireAdmin, updateUserRole);

// Profile update (self)
router.patch('/profile', updateProfile);

export default router;
