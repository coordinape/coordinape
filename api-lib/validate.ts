import * as Sentry from '@sentry/node';
// sentry docs say to import this, but it remains unused -CG
// Importing @sentry/tracing patches the global hub for tracing to work.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as Tracing from '@sentry/tracing';
import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { HASURA_EVENT_SECRET, SENTRY_DSN } from './config';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,

    // below note is from sentry docs, but i think we should keep this at 1.0 for now -CG
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

export const verifyHasuraRequestMiddleware = (handler: VercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (
      !req.headers.verification_key ||
      (req.headers.verification_key as string) !== HASURA_EVENT_SECRET
    ) {
      // return here to prevent further execution
      res.status(401).json({
        message: 'Unauthorized access',
        code: '401',
      });
      return;
    }
    try {
      await handler(req, res);
    } catch (error: any) {
      Sentry.captureException(error);
      res.status(500).json({
        code: '500',
        message: 'internal error: ' + error,
      });
    }
  };
};
