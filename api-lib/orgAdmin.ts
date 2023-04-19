import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { isOrgAdmin } from './findUser';
import { UnauthorizedError } from './HttpError';
import { composeHasuraActionRequestBodyWithApiPermissions } from './requests/schema';
import { verifyHasuraRequestMiddleware } from './validate';

const requestSchema = composeHasuraActionRequestBodyWithApiPermissions(
  z.object({ org_id: z.number() }).strip(),
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
      handler(req, res);
      return;
    }

    if (sessionVariables.hasuraRole === 'user') {
      const { org_id } = input;
      const profileId = sessionVariables.hasuraProfileId;

      if (await isOrgAdmin(org_id, profileId)) {
        handler(req, res);
        return;
      } else {
        throw new UnauthorizedError('User is not org admin');
      }
    }
  };

export const authOrgAdminMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraRequestMiddleware(middleware(handler));
