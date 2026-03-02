import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200
): void => {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Error',
  errors?: any[],
  statusCode = 500
): void => {
  const response: ApiResponse = {
    status: 'error',
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T,
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message = 'Success'
): void => {
  const response: PaginatedResponse<T> = {
    status: 'success',
    message,
    data,
    pagination: {
      ...pagination,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  };
  res.status(200).json(response);
};
