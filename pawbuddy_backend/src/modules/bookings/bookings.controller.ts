import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth.js';
import { Booking, Pet, User } from '../../models/index.js';
import { sendSuccess, sendError, sendPaginated } from '../../utils/response.js';
import {
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  createBookingSchema,
  updateBookingStatusSchema,
} from './bookings.validator.js';

/**
 * Create adoption booking (adopter only)
 */
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const body = createBookingSchema.parse(req.body);

    // Verify pet exists
    const pet = await Pet.findById(body.petId);
    if (!pet) {
      sendError(res, 'Pet not found', undefined, 404);
      return;
    }

    // Check for duplicate active booking
    const existingBooking = await Booking.findOne({
      adopterId: req.user.userId,
      petId: body.petId,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingBooking) {
      sendError(res, 'You already have an active booking for this pet', undefined, 400);
      return;
    }

    // Get user info
    const user = await User.findById(req.user.userId);
    if (!user) {
      sendError(res, 'User not found', undefined, 404);
      return;
    }

    // Create booking
    const booking = await Booking.create({
      petId: body.petId,
      petName: pet.name,
      petImage: pet.images?.[0] || '',
      adopterId: req.user.userId,
      adopterName: user.name,
      adopterEmail: user.email,
      adopterPhone: user.phone || '',
      message: body.message,
      homeType: body.homeType,
      yardStatus: body.yardStatus,
      workSchedule: body.workSchedule,
      currentPets: body.currentPets,
      petExperience: body.petExperience,
      lifetimeCommitment: body.lifetimeCommitment,
      status: 'pending',
      submittedAt: new Date(),
    });

    // Optionally update pet status to pending
    await Pet.findByIdAndUpdate(body.petId, { status: 'pending' });

    const transformedBooking = {
      ...booking.toObject(),
      id: booking._id.toString(),
      submittedAt: booking.submittedAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedBooking, 'Booking created successfully', 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Create booking error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize as string) || 10);
    const skip = (page - 1) * pageSize;

    const [bookings, total] = await Promise.all([
      Booking.find({ adopterId: req.user.userId })
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Booking.countDocuments({ adopterId: req.user.userId }),
    ]);

    const transformedBookings = bookings.map((b: any) => ({
      ...b,
      id: b._id.toString(),
      submittedAt: b.submittedAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      createdAt: b.createdAt.toISOString(),
      _id: undefined,
      __v: undefined,
    }));

    sendPaginated(
      res,
      transformedBookings,
      { page, pageSize, total },
      'Bookings retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Get user bookings error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Cancel booking (adopter can only cancel own pending bookings)
 */
export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 'User not authenticated', undefined, 401);
      return;
    }

    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      sendError(res, 'Booking not found', undefined, 404);
      return;
    }

    // Check if booking belongs to user
    if (booking.adopterId !== req.user.userId) {
      sendError(res, 'You cannot cancel this booking', undefined, 403);
      return;
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      sendError(res, 'You can only cancel pending bookings', undefined, 400);
      return;
    }

    // Delete booking
    await Booking.findByIdAndDelete(id);

    sendSuccess(res, null, 'Booking cancelled successfully', 200);
  } catch (error) {
    console.error('Cancel booking error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const pageSize = Math.min(100, parseInt(req.query.pageSize as string) || 10);
    const status = req.query.status as string | undefined;
    const skip = (page - 1) * pageSize;

    const filter: any = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    const transformedBookings = bookings.map((b: any) => ({
      ...b,
      id: b._id.toString(),
      submittedAt: b.submittedAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      createdAt: b.createdAt.toISOString(),
      _id: undefined,
      __v: undefined,
    }));

    sendPaginated(
      res,
      transformedBookings,
      { page, pageSize, total },
      'Bookings retrieved successfully',
      200
    );
  } catch (error) {
    console.error('Get all bookings error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};

/**
 * Update booking status (admin only)
 */
export const updateBookingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const body = updateBookingStatusSchema.parse(req.body);

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true, runValidators: true }
    ).lean();

    if (!booking) {
      sendError(res, 'Booking not found', undefined, 404);
      return;
    }

    // If approved, update pet status to adopted
    if (body.status === 'approved') {
      await Pet.findByIdAndUpdate(booking.petId, { status: 'adopted' });
    }

    const transformedBooking = {
      ...booking,
      id: booking._id.toString(),
      submittedAt: booking.submittedAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      createdAt: booking.createdAt.toISOString(),
      _id: undefined,
      __v: undefined,
    };

    sendSuccess(res, transformedBooking, 'Booking status updated successfully', 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      sendError(res, 'Validation error', JSON.stringify(error.issues), 400);
      return;
    }
    console.error('Update booking status error:', error);
    sendError(res, 'Internal server error', undefined, 500);
  }
};
