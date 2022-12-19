import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { HasuraUserSessionVariables } from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
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
      operationName: 'logoutUser_deleteToken',
    }
  );
  return res.status(200).json({ id: hasuraProfileId });
}

export default verifyHasuraRequestMiddleware(handler);
