import assert from 'assert';

import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { HasuraActionRequestBody, circleIdInput } from '../src/lib/zod';

import { getUserFromProfileId } from './findUser';
import { verifyHasuraRequestMiddleware } from './validate';

const middleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse) => {
    console.error(req.body);
    try {
      const { input: rawInput, session_variables: sessionVariables } =
        HasuraActionRequestBody.parse(req.body);

      if (sessionVariables.hasuraRole !== 'admin') {
        const { circle_id } = circleIdInput.parse(rawInput);
        const profileId = sessionVariables.hasuraProfileId;

        const { role } = await getUserFromProfileId(profileId, circle_id);
        assert(isCircleAdmin(role));
      }
    } catch (err) {
      console.error('erroring');
      if (err instanceof z.ZodError) {
        res.status(422).json({
          extensions: err.issues,
          message: 'Invalid input',
          code: '422',
        });
        return;
      }
      res.status(401).json({
        message: 'User not circle admin',
        code: 401,
      });
      return;
    }
    // the admin role is validated early by zod

    await handler(req, res);
  };

const isCircleAdmin = (role: number): boolean => role === 1;

export const authCircleAdminMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraRequestMiddleware(middleware(handler));
