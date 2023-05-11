import type {
  VercelRequest,
  VercelResponse,
  VercelApiHandler,
} from '@vercel/node';
import { z } from 'zod';

import { getUserFromProfileId } from './findUser';
import { getInput } from './handlerHelpers';
import { errorResponseWithStatusCode, UnauthorizedError } from './HttpError';

const circleIdInput = z.object({ circle_id: z.number() }).strip();

export const authCircleAdminMiddleware =
  (handler: VercelApiHandler) =>
  async (req: VercelRequest, res: VercelResponse): Promise<void> => {
    const { payload, session } = await getInput(req, circleIdInput, {
      apiPermissions: [],
    });

    // the admin role is validated early by zod
    if (session.hasuraRole === 'admin') {
      await handler(req, res);
      return;
    }

    if (session.hasuraRole === 'user') {
      const { circle_id } = payload;
      const profileId = session.hasuraProfileId;

      const { role } = await getUserFromProfileId(profileId, circle_id);
      if (isCircleAdmin(role)) {
        await handler(req, res);
        return;
      }
    }

    if (session.hasuraRole === 'api-user') {
      const { circle_id } = payload;

      if (circle_id !== session.hasuraCircleId) {
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
