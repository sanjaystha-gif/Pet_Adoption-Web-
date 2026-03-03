import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth.js';
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from './bookings.controller.js';

const router = Router();

// Adopter routes
router.post('/', authenticate, createBooking);
router.get('/me', authenticate, getUserBookings);
router.delete('/:id', authenticate, cancelBooking);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, getAllBookings);
router.patch('/admin/:id/status', authenticate, requireAdmin, updateBookingStatus);

export default router;
