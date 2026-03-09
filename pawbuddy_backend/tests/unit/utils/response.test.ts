import { describe, it, expect, vi } from 'vitest';
import type { Response } from 'express';
import { sendError, sendPaginated, sendSuccess } from '../../../src/utils/response.ts';

const createMockResponse = (): Response => {
  const res: Partial<Response> = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };

  return res as Response;
};

describe('utils/response', () => {
  it('sendSuccess returns a success response body', () => {
    const res = createMockResponse();

    sendSuccess(res, { id: '123' }, 'Created', 201);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { id: '123' },
      message: 'Created',
    });
  });

  it('sendError returns an error response body', () => {
    const res = createMockResponse();

    sendError(res, 'Bad Request', undefined, 400);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Bad Request',
      message: 'Bad Request',
    });
  });

  it('sendPaginated returns pagination metadata and computed totalPages', () => {
    const res = createMockResponse();

    sendPaginated(
      res,
      [{ id: 'a' }, { id: 'b' }],
      {
        page: 2,
        pageSize: 10,
        total: 25,
      },
      'Fetched'
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        items: [{ id: 'a' }, { id: 'b' }],
        pagination: {
          page: 2,
          pageSize: 10,
          total: 25,
          totalPages: 3,
        },
      },
      message: 'Fetched',
    });
  });
});
