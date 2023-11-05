import { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponse, sentryFlush } from './HttpError';

export declare type AsyncVercelApiHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<VercelResponse | void>;

export const handlerSafe = (handler: AsyncVercelApiHandler) => {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await handler(req, res);
      await sentryFlush();
    } catch (error: any) {
      return errorResponse(res, error);
    }
  };
};
