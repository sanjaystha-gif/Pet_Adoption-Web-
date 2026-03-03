import { z } from 'zod';

const currentPetSchema = z.object({
  type: z.string().min(1, 'Pet type is required'),
  breed: z.string().min(1, 'Pet breed is required'),
  name: z.string().min(1, 'Pet name is required'),
});

export const createBookingSchema = z.object({
  petId: z.string().min(1, 'Pet ID is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  homeType: z.string().optional(),
  yardStatus: z.string().optional(),
  workSchedule: z.string().optional(),
  currentPets: z.array(currentPetSchema).optional(),
  petExperience: z.string().optional(),
  lifetimeCommitment: z.boolean().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: 'Status must be pending, approved, or rejected',
  }),
});

export type CreateBookingRequest = z.infer<typeof createBookingSchema>;
export type UpdateBookingStatusRequest = z.infer<typeof updateBookingStatusSchema>;
