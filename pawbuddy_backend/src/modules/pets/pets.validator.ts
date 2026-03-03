import { z } from 'zod';

export const createPetSchema = z.object({
  name: z.string().min(1, 'Pet name is required').trim(),
  type: z.enum(['dog', 'cat'], { message: 'Type must be dog or cat' }),
  breed: z.string().min(1, 'Breed is required').trim(),
  age: z.number().min(0, 'Age must be non-negative (in months)'),
  gender: z.enum(['male', 'female'], { message: 'Gender must be male or female' }),
  size: z.enum(['small', 'medium', 'large'], { message: 'Size must be small, medium, or large' }),
  color: z.string().min(1, 'Color is required').trim(),
  weight: z.string().min(1, 'Weight is required').trim(),
  vaccinated: z.boolean().default(false),
  neutered: z.boolean().default(false),
  status: z.enum(['available', 'pending', 'adopted']).default('available'),
  description: z.string().min(10, 'Description must be at least 10 characters').trim(),
  personality: z.array(z.string()).default([]),
  images: z.array(z.string().url('Each image must be a valid URL')).default([]),
  location: z.string().min(1, 'Location is required').trim(),
});

export const updatePetSchema = createPetSchema.partial();

export const petFilterSchema = z.object({
  q: z.string().optional(),
  type: z.enum(['dog', 'cat']).optional(),
  breed: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  size: z.enum(['small', 'medium', 'large']).optional(),
  status: z.enum(['available', 'pending', 'adopted']).optional(),
  color: z.string().optional(),
  location: z.string().optional(),
  ageRange: z.enum(['baby', 'young', 'adult', 'senior']).optional(),
  sort: z.enum(['newest', 'oldest', 'name-asc', 'name-desc']).optional().default('newest'),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export type CreatePetRequest = z.infer<typeof createPetSchema>;
export type UpdatePetRequest = z.infer<typeof updatePetSchema>;
export type PetFilterRequest = z.infer<typeof petFilterSchema>;
