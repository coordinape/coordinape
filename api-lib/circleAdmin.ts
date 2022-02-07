import assert from 'assert';

import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { getUserFromAuthHeader } from './findUser';
import { verifyHasuraAdminMiddleware } from './validate';

const middleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse) => {
    // skip auth check if no header is passed
    // because we can assume the user is a hasura-admin
    if (req.headers.authorization) {
      const circleId = z.number().parse(req.body.input.circle_id);
      const { role } = await getUserFromAuthHeader(
        req.headers.authorization,
        circleId
      );
      if (role !== 1) {
        return res.status(401).json({
          message: 'User not circle admin',
          code: 401,
        });
      }
    }

    await handler(req, res);
  };

export const authCircleAdminMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraAdminMiddleware(middleware(handler));
