import { z } from 'zod';

// Example pet validation schema using Zod
export const createPetSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    species: z.enum(['dog', 'cat', 'other']),
    breed: z.string().min(2),
    age: z.number().int().min(0).max(30),
    gender: z.enum(['male', 'female']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    status: z.enum(['available', 'adopted', 'pending']).optional().default('available'),
  }),
});

export const updatePetSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    species: z.enum(['dog', 'cat', 'other']).optional(),
    breed: z.string().min(2).optional(),
    age: z.number().int().min(0).max(30).optional(),
    gender: z.enum(['male', 'female']).optional(),
    description: z.string().min(10).optional(),
    status: z.enum(['available', 'adopted', 'pending']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Pet ID is required'),
  }),
});

export const getPetSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Pet ID is required'),
  }),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type GetPetInput = z.infer<typeof getPetSchema>;
