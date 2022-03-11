import * as Sentry from '@sentry/node';
// sentry docs say to import this, but it remains unused -CG
// Importing @sentry/tracing patches the global hub for tracing to work.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Tracing from '@sentry/tracing';
import { VercelResponse } from '@vercel/node';
import { ZodIssue } from 'zod';

import { SENTRY_DSN } from './config';

const awaitSentryFlushMs = 1000;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

export interface HttpError extends Error {
  httpStatus: number;
  details?: any;
}

export class InternalServerError extends Error implements HttpError {
  // TODO: it seems like hasura doesn't like 500s so we should pick a 4xx as the default error
  httpStatus = 500;
}

export class PayloadTooLargeError extends Error implements HttpError {
  httpStatus = 413;
}

export class NotFoundError extends Error implements HttpError {
  httpStatus = 404;
}

export class ForbiddenError extends Error implements HttpError {
  httpStatus = 403;
}

export class BadRequestError extends Error implements HttpError {
  httpStatus = 400;
}

export class UnprocessableError extends Error implements HttpError {
  httpStatus = 422;
  details?: any;
}

export function errorResponse(res: VercelResponse, error: any): void {
  const statusCode = error.httpStatus || 500;
  errorResponseWithStatusCode(res, error, statusCode);
}

export function errorResponseWithStatusCode(
  res: VercelResponse,
  error: any,
  statusCode: number
): void {
  Sentry.captureException(error);
  // We have to await this flush otherwise we exit before reporting to sentry
  Sentry.flush(awaitSentryFlushMs).then(() => {
    res.status(statusCode).json({
      message: error.message || 'Unexpected error',
      // included at this level for backwards compat w/ older hasura, perhaps can remove
      code: `${statusCode}`,
      extensions: {
        code: `${statusCode}`,
        details: error.details || undefined,
      },
    });
  });
}

export function zodParserErrorResponse(
  res: VercelResponse,
  issues: ZodIssue[]
): void {
  const ue = new UnprocessableError('data validation error');
  ue.details = issues;
  errorResponse(res, ue);
}
