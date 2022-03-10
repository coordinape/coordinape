import { VercelResponse } from '@vercel/node';
import { ZodIssue } from 'zod';

export interface HttpError extends Error {
  httpStatus: number;
}

export class InternalServerError extends Error implements HttpError {
  httpStatus = 500;
}

export class PayloadTooLargeError extends Error implements HttpError {
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

export function zodParserErrorResponse(
  res: VercelResponse,
  issues: ZodIssue[]
): VercelResponse {
  return res.status(422).json({
    extensions: issues,
    message: 'Invalid input',
    code: '422',
  });
}
