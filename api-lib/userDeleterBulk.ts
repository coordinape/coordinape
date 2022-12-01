import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';

import {
  deleteUserBulkInput,
  composeHasuraActionRequestBodyWithApiPermissions,
} from '../src/lib/zod';

import { errorResponseWithStatusCode, UnauthorizedError } from './HttpError';
import { verifyHasuraRequestMiddleware } from './validate';

const requestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  deleteUserBulkInput,
  []
);

const middleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const {
      input: { payload: input },
      session_variables: sessionVariables,
    } = await requestSchema.parseAsync(req.body);

    // the admin role is validated early by zod
    if (sessionVariables.hasuraRole === 'admin') {
      await handler(req, res);
      return;
    }

    if (sessionVariables.hasuraRole === 'api-user') {
      const { circle_id } = input;

      if (circle_id !== sessionVariables.hasuraCircleId) {
        return errorResponseWithStatusCode(
          res,
          { message: `API Key does not belong to circle ID ${circle_id}` },
          403
        );
      }

      await handler(req, res);
      return;
    }

    // Reject request if not validated above
    throw new UnauthorizedError('User not circle admin');
  };

const isCircleAdmin = (role: number): boolean => role === 1;

export const authUserDeleterBulkMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraRequestMiddleware(middleware(handler));
