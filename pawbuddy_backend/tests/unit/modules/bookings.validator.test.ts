import { describe, it, expect } from 'vitest';
import {
  createBookingSchema,
  updateBookingStatusSchema,
} from '../../../src/modules/bookings/bookings.validator.ts';

describe('bookings.validator', () => {
  it('accepts valid booking payload with current pets', () => {
    const result = createBookingSchema.safeParse({
      petId: 'pet-1',
      message: 'I have a lot of experience caring for pets.',
      currentPets: [
        {
          type: 'dog',
          breed: 'Labrador',
          name: 'Max',
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it('rejects booking payload with too short message', () => {
    const result = createBookingSchema.safeParse({
      petId: 'pet-2',
      message: 'Too short',
    });

    expect(result.success).toBe(false);
  });

  it('accepts valid booking status updates', () => {
    const result = updateBookingStatusSchema.safeParse({
      status: 'approved',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid booking status', () => {
    const result = updateBookingStatusSchema.safeParse({
      status: 'archived',
    });

    expect(result.success).toBe(false);
  });
});
