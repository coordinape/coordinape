import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { HASURA_EVENT_SECRET } from './config';
import {
  errorResponse,
  errorResponseWithStatusCode,
  sentryFlush,
} from './HttpError';

export const verifyHasuraRequestMiddleware = (handler: VercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    if (
      !req.headers.verification_key ||
      (req.headers.verification_key as string) !== HASURA_EVENT_SECRET
    ) {
      errorResponseWithStatusCode(res, 'Unauthorized access', 401);
      // return here to prevent further execution
      return;
    }
    try {
      await handler(req, res);
      await sentryFlush();
    } catch (error: any) {
      errorResponse(res, error);
    }
  };
};
