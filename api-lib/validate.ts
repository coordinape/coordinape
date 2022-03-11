import { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';

import { HASURA_EVENT_SECRET } from './config';
import { errorResponse } from './HttpError';

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
      errorResponse(res, error);
    }
  };
};
