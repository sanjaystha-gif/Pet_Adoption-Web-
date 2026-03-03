import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
} from './auth.controller.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
