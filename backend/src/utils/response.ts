import { Response } from 'express';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendSuccess = (
  res: Response,
  data: unknown,
  message = 'Success',
  statusCode = 200
) => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendPaginatedSuccess = (
  res: Response,
  data: unknown,
  pagination: PaginationMeta,
  message = 'Success'
) => {
  res.status(200).json({ success: true, message, data, pagination });
};

export const sendError = (
  res: Response,
  message = 'Something went wrong',
  statusCode = 500,
  errors?: unknown
) => {
  res.status(statusCode).json({ success: false, message, errors });
};
