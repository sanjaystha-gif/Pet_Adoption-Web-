import { z } from 'zod';

/**
 * Update profile schema
 * - Only accepts name, phone, city, bio, avatar
 * - All fields are optional (partial update)
 * - avatar must be a valid URL or null
 */
export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(80, 'Name must not exceed 80 characters')
      .trim()
      .optional(),
    phone: z
      .string()
      .max(30, 'Phone must not exceed 30 characters')
      .trim()
      .nullable()
      .optional(),
    city: z
      .string()
      .max(80, 'City must not exceed 80 characters')
      .trim()
      .nullable()
      .optional(),
    bio: z
      .string()
      .max(500, 'Bio must not exceed 500 characters')
      .trim()
      .nullable()
      .optional(),
    avatar: z
      .string()
      .url('Avatar must be a valid URL')
      .max(500, 'Avatar URL must not exceed 500 characters')
      .nullable()
      .optional(),
  })
  .strict() // Reject unknown fields
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>;
