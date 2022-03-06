import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { HASURA_EVENT_SECRET } from './config';
import { errorResponse, sentryFlush, UnauthorizedError } from './HttpError';

export const verifyHasuraRequestMiddleware = (handler: VercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      if (
        !req.headers.verification_key ||
        (req.headers.verification_key as string) !== HASURA_EVENT_SECRET
      ) {
        // return here to prevent further execution
        throw new UnauthorizedError('Unauthorized access');
      }

      await handler(req, res);
      await sentryFlush();
    } catch (error: any) {
      errorResponse(res, error);
    }
  };
};
