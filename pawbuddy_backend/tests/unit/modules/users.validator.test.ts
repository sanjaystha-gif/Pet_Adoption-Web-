import { describe, it, expect } from 'vitest';
import { updateProfileSchema } from '../../../src/modules/users/users.validator.ts';

describe('users.validator', () => {
  it('accepts valid partial updates and trims strings', () => {
    const parsed = updateProfileSchema.parse({
      name: '  John Doe  ',
      city: '  Dhaka  ',
    });

    expect(parsed.name).toBe('John Doe');
    expect(parsed.city).toBe('Dhaka');
  });

  it('rejects payload with no fields', () => {
    const result = updateProfileSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('rejects unknown fields', () => {
    const result = updateProfileSchema.safeParse({
      name: 'Jane',
      email: 'new@example.com',
    });

    expect(result.success).toBe(false);
  });

  it('rejects invalid avatar URL', () => {
    const result = updateProfileSchema.safeParse({
      avatar: 'not-a-url',
    });

    expect(result.success).toBe(false);
  });
});
