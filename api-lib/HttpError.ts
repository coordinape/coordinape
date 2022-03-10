import { VercelResponse } from '@vercel/node';
import { ZodIssue } from 'zod';

export interface HttpError extends Error {
  httpStatus: number;
}

export class InternalServerError extends Error implements HttpError {
  // TODO: it seems like hasura doesn't like 500s so we should pick a 4xx as the default error
  httpStatus = 500;
}

export class PayloadTooLargeError extends Error implements HttpError {
  httpStatus = 413;
}

export class NotFoundError extends Error {
  httpStatus = 404;
}

export class ForbiddenError extends Error {
  httpStatus = 403;
}

export class BadRequestError extends Error {
  httpStatus = 400;
}

export function errorResponse(res: VercelResponse, error: any): VercelResponse {
  const statusCode = error.httpStatus || 500;
  return errorResponseWithStatusCode(res, error, statusCode);
}

export function errorResponseWithStatusCode(
  res: VercelResponse,
  error: any,
  statusCode: number
): VercelResponse {
  return res.status(statusCode).json({
    message: error.message || 'Unexpected error',
    // included at this level for backwards compat w/ older hasura, perhaps can remove
    code: `${statusCode}`,
    extensions: {
      code: `${statusCode}`,
    },
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
