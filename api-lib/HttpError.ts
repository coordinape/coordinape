import { VercelResponse } from '@vercel/node';

export interface HttpError extends Error {
  httpStatus: number;
}

export class InternalServerError extends Error {
  httpStatus = 500;
}

export class PayloadTooLargeError extends Error {
  httpStatus = 413;
}

export function ErrorResponse(res: VercelResponse, error: any): VercelResponse {
  const statusCode = error.httpStatus || 500;
  return ErrorResponseWithStatusCode(res, error, statusCode);
}

export function ErrorResponseWithStatusCode(
  res: VercelResponse,
  error: any,
  statusCode: number
): VercelResponse {
  return res.status(statusCode).json({
    error: `${statusCode}`,
    message: error.message || 'Unexpected error',
  });
}
