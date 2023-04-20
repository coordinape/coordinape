import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { isOrgAdmin } from './findUser';
import { getInput } from './handlerHelpers';
import { UnauthorizedError } from './HttpError';
import { verifyHasuraRequestMiddleware } from './validate';

const schema = z.object({ org_id: z.number() }).strip();

const middleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const { payload, session } = await getInput(req, schema, {
      apiPermissions: [],
    });

    // the admin role is validated early by zod
    if (session.hasuraRole === 'admin') {
      handler(req, res);
      return;
    }

    if (session.hasuraRole === 'user') {
      const profileId = session.hasuraProfileId;

      if (await isOrgAdmin(payload.org_id, profileId)) {
        handler(req, res);
        return;
      } else {
        throw new UnauthorizedError('User is not org admin');
      }
    }
  };

export const authOrgAdminMiddleware = (handler: VercelApiHandler) =>
  verifyHasuraRequestMiddleware(middleware(handler));
