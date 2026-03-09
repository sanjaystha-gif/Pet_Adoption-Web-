import { describe, it, expect } from 'vitest';
import {
  changePasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from '../../../src/modules/auth/auth.validator.ts';

describe('auth.validator', () => {
  it('registerSchema normalizes email and defaults role', () => {
    const parsed = registerSchema.parse({
      name: 'Alice',
      email: 'ALICE@EXAMPLE.COM',
      password: 'password123',
    });

    expect(parsed.email).toBe('alice@example.com');
    expect(parsed.role).toBe('adopter');
  });

  it('loginSchema rejects invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'x',
    });

    expect(result.success).toBe(false);
  });

  it('refreshTokenSchema requires refresh token', () => {
    const result = refreshTokenSchema.safeParse({ refreshToken: '' });

    expect(result.success).toBe(false);
  });

  it('changePasswordSchema enforces minimum new password length', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'old-password',
      newPassword: '123',
    });

    expect(result.success).toBe(false);
  });
});
