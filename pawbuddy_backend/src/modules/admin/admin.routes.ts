import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import {
  getAllUsers,
  updateUserRole,
  updateProfile,
} from './admin.controller.js';

const router = Router();

// Apply authentication to all admin routes
router.use(authenticate);

// User management (admin only)
router.get('/users', requireAdmin, getAllUsers);
router.patch('/users/:id/role', requireAdmin, updateUserRole);

// Profile update (self)
router.patch('/profile', updateProfile);

export default router;
