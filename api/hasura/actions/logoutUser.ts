import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  errorResponse,
  errorResponseWithStatusCode,
} from '../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { HasuraUserSessionVariables } from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { hasuraProfileId } = HasuraUserSessionVariables.parse(
      req.body.session_variables
    );
    await adminClient.mutate(
      {
        delete_personal_access_tokens: [
          {
            where: {
              tokenable_id: { _eq: hasuraProfileId },
              tokenable_type: { _eq: 'App\\Models\\Profile' },
            },
          },
          {
            affected_rows: true,
          },
        ],
      },
      {
        operationName: 'logoutUser-deleteToken',
      }
    );
    return res.status(200).json({ id: hasuraProfileId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return errorResponse(res, err);
    }
    return errorResponseWithStatusCode(res, 'Unexpected error', 401);
  }
}

export default verifyHasuraRequestMiddleware(handler);
