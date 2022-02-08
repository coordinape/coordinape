import assert from 'assert';

import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { getUserFromProfileId } from './findUser';
import { verifyHasuraAdminMiddleware } from './validate';

const middleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse) => {
    const sessionVariables = req.body.session_variables;
    if (hasUserId(sessionVariables)) {
      const circleId = z.number().parse(req.body.input.circle_id);
      const profileId = z
        .string()
        .refine(
          s => Number.parseInt(s).toString() === s,
          'profileId not an integer'
        )
        .transform(Number.parseInt)
        .parse(sessionVariables['x-hasura-user-id']);
      const { role } = await getUserFromProfileId(profileId, circleId);
      if (isNotCircleAdmin(role)) {
        res.status(401).json({
          message: 'User not circle admin',
          code: 401,
        });
        return;
      }
    } else if (isNotHasuraAdmin(sessionVariables)) {
      res.status(401).json({
        message: 'Unauthorized access',
        code: 401,
      });
      return;
    }

    await handler(req, res);
  };

const hasUserId = (vars: unknown): boolean => {
  return !!vars['x-hasura-user-id'];
};

const isNotCircleAdmin = (role: number): boolean => role !== 1;

const isNotHasuraAdmin = (vars: unknown): boolean => {
  return vars['x-hasura-role'] !== 'admin';
};

export const authCircleAdminMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraAdminMiddleware(middleware(handler));
