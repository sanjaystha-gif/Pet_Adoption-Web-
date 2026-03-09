import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import app from '../../src/app.ts';

let errorSpy: ReturnType<typeof vi.spyOn>;

beforeAll(() => {
  // These scenarios intentionally trigger 401 errors via middleware.
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  errorSpy.mockRestore();
});

describe('Backend integration: app routes', () => {
  it('GET /health returns service status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body.status).toBe('ok');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('PATCH /api/users/me rejects request without auth token', async () => {
    const response = await request(app)
      .patch('/api/users/me')
      .send({ name: 'New Name' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('No authentication token');
  });

  it('PATCH /api/users/me rejects request with invalid token', async () => {
    const response = await request(app)
      .patch('/api/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .send({ name: 'New Name' })
      .expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Invalid or expired token');
  });

  it('returns 404 for unknown API route', async () => {
    const response = await request(app).get('/api/non-existing-route').expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Route not found');
  });
});
