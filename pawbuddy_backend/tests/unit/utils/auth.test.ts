import { describe, it, expect } from 'vitest';
import {
  comparePassword,
  compareToken,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../src/utils/auth.ts';

describe('utils/auth', () => {
  it('generates and verifies an access token', () => {
    const payload = {
      userId: 'user-123',
      email: 'user@example.com',
      role: 'adopter' as const,
    };

    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  it('generates and verifies a refresh token', () => {
    const userId = 'refresh-user-1';

    const token = generateRefreshToken(userId);
    const decoded = verifyRefreshToken(token);

    expect(decoded.userId).toBe(userId);
  });

  it('throws for an invalid access token', () => {
    expect(() => verifyAccessToken('invalid-token')).toThrow();
  });

  it('hashes password and compares successfully', async () => {
    const plainPassword = 'Secret123!';

    const hashed = await hashPassword(plainPassword);
    const isMatch = await comparePassword(plainPassword, hashed);

    expect(hashed).not.toBe(plainPassword);
    expect(isMatch).toBe(true);
  });

  it('fails password comparison for incorrect password', async () => {
    const hashed = await hashPassword('CorrectPassword');

    const isMatch = await comparePassword('WrongPassword', hashed);

    expect(isMatch).toBe(false);
  });

  it('hashes and compares refresh token values', async () => {
    const token = 'some-refresh-token-value';

    const hashed = await hashToken(token);
    const isMatch = await compareToken(token, hashed);
    const mismatch = await compareToken('different-token', hashed);

    expect(isMatch).toBe(true);
    expect(mismatch).toBe(false);
  });
});
