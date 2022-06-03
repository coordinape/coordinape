import * as Sentry from '@sentry/node';
// sentry docs say to import this, but it remains unused -CG
// Importing @sentry/tracing patches the global hub for tracing to work.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Tracing from '@sentry/tracing';
import { VercelResponse } from '@vercel/node';
import { ZodError } from 'zod';

import { flattenZeusError, GQLError } from '../src/common-lib/errorHandling';

import { SENTRY_DSN } from './config';
import { GraphQLError } from './gql/__generated__/zeus';

const awaitSentryFlushMs = 1000;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 0.1,
    normalizeDepth: 50,
    ignoreErrors: [
      'Error sending telegram notification',
      'Discord Daily Update error for circle',
    ],
  });
  Sentry.setTag('application', 'vercel');
}

interface HttpError extends Error {
  httpStatus: number;
  details?: any;
  causeMessage?: string;
}

class BaseHttpError extends Error implements HttpError {
  causeMessage?: string;
  constructor(message: string, cause?: any) {
    super(message);
    if (cause) {
      if (cause.stack) {
        this.stack = cause.stack;
      }
      if (cause.message) {
        this.causeMessage = cause.message;
      }
    }
  }
  httpStatus = 400; // default since hasura doesn't like 500s
}

export class InternalServerError extends BaseHttpError {
  // TODO: it seems like hasura doesn't like 500s so we should pick a 4xx as the default error
  httpStatus = 500;
}

export class PayloadTooLargeError extends BaseHttpError {
  httpStatus = 413;
}

export class NotFoundError extends BaseHttpError {
  httpStatus = 404;
}

export class ForbiddenError extends BaseHttpError {
  httpStatus = 403;
}

export class UnauthorizedError extends BaseHttpError {
  httpStatus = 401;
}

export class UnprocessableError extends BaseHttpError {
  httpStatus = 422;
  details?: any;
}

export function errorResponse(res: VercelResponse, error: any): void {
  if (error instanceof ZodError) {
    return zodParserErrorResponse(res, error);
  } else if (error instanceof GraphQLError) {
    const err = flattenZeusError(error as GQLError);
    return errorResponseWithStatusCode(res, err, 422);
  }
  const statusCode = error.httpStatus || 500;
  errorResponseWithStatusCode(res, error, statusCode);
}

export function errorResponseWithStatusCode(
  res: VercelResponse,
  error: any,
  statusCode: number
): void {
  Sentry.withScope(scope => {
    if (error.details) {
      scope.setExtra('details', error.details);
      if (error.details.path) {
        scope.addBreadcrumb({
          category: 'query-path',
          message: error.details.path,
          level: Sentry.Severity.Debug,
        });
      }
    }
    if (error.causeMessage) {
      scope.setExtra('cause', error.causeMessage);
    }
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else if (error.message) {
      // Sentry much prefers an Error object to a string/object
      Sentry.captureException(new Error(error.message));
    } else {
      // No idea what's going on here so at least get an error with a string in it
      Sentry.captureException(new Error(JSON.stringify(error)));
    }
  });
  // We have to await this flush otherwise we exit before reporting to sentry
  Sentry.flush(awaitSentryFlushMs).then(() => {
    const errObject = {
      message: error.message || 'Unexpected error',
      extensions: {
        code: `${statusCode}`,
        details: error.details || undefined,
      },
    };
    res.status(statusCode).json(errObject);
  });
}

function zodParserErrorResponse(res: VercelResponse, zodError: ZodError): void {
  let msg = 'Invalid input';
  const issues = zodError.issues;
  if (issues.length > 0) {
    msg = msg + ':';
  }
  for (let i = 0; i < issues.length; i++) {
    msg = msg + ' ' + issues[i].message;
    msg = msg + ' (' + issues[i].path[issues[i].path.length - 1] + ')';
    if (i < issues.length - 1) {
      msg = msg + ',';
    }
  }

  const ue = new UnprocessableError(msg, zodError);
  ue.details = issues;
  errorResponse(res, ue);
}

export function errorLog(message: string, reportToSentry = true) {
  if (reportToSentry) {
    Sentry.captureMessage(message);
  }
  console.error(message);
}

export const sentryFlush = async () => {
  await Sentry.flush(awaitSentryFlushMs);
};
