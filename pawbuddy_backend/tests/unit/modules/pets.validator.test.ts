import { describe, it, expect } from 'vitest';
import {
  createPetSchema,
  petFilterSchema,
  updatePetSchema,
} from '../../../src/modules/pets/pets.validator.ts';

describe('pets.validator', () => {
  it('createPetSchema applies defaults for optional fields', () => {
    const parsed = createPetSchema.parse({
      name: 'Leo',
      type: 'cat',
      breed: 'Persian',
      age: 8,
      gender: 'male',
      size: 'small',
      color: 'White',
      weight: '4kg',
      description: 'Friendly indoor cat',
      location: 'Dhaka',
    });

    expect(parsed.vaccinated).toBe(false);
    expect(parsed.neutered).toBe(false);
    expect(parsed.status).toBe('available');
    expect(parsed.personality).toEqual([]);
    expect(parsed.images).toEqual([]);
  });

  it('createPetSchema rejects unsupported type', () => {
    const result = createPetSchema.safeParse({
      name: 'Buddy',
      type: 'bird',
      breed: 'Parrot',
      age: 12,
      gender: 'male',
      size: 'small',
      color: 'Green',
      weight: '1kg',
      description: 'Colorful and social pet',
      location: 'Dhaka',
    });

    expect(result.success).toBe(false);
  });

  it('updatePetSchema accepts partial updates', () => {
    const result = updatePetSchema.safeParse({
      status: 'adopted',
    });

    expect(result.success).toBe(true);
  });

  it('petFilterSchema coerces pagination and provides defaults', () => {
    const parsed = petFilterSchema.parse({
      page: '2',
      pageSize: '15',
    });

    expect(parsed.page).toBe(2);
    expect(parsed.pageSize).toBe(15);
    expect(parsed.sort).toBe('newest');
  });
});
