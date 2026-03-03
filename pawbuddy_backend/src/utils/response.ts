import { Response } from 'express';
import { ApiResponse, PaginatedApiResponse, PaginatedData } from '../types/index.js';

/**
 * Send a successful response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message: message || undefined,
  };
  res.status(statusCode).json(response);
};

/**
 * Send an error response
 */
export const sendError = (
  res: Response,
  error: string,
  message?: string,
  statusCode = 500
): void => {
  const response: ApiResponse = {
    success: false,
    error,
    message: message || error,
  };
  res.status(statusCode).json(response);
};

/**
 * Send a paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  items: T[],
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  },
  message = 'Success',
  statusCode = 200
): void => {
  const data: PaginatedData<T> = {
    items,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.pageSize),
    },
  };

  const response: PaginatedApiResponse<T> = {
    success: true,
    data,
    message: message || undefined,
  };

  res.status(statusCode).json(response);
};
  res.status(200).json(response);
};
