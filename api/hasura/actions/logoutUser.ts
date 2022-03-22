import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import { HasuraUserSessionVariables } from '../../../src/lib/zod';

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const { hasuraProfileId } = HasuraUserSessionVariables.parse(
      request.body.session_variables
    );
    await adminClient.mutate({
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
    });
    return response.status(200).json({ id: hasuraProfileId });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    }
    return response.status(401).json({
      message: 'Unexpected error',
      code: '401',
    });
  }
}

export default verifyHasuraRequestMiddleware(handler);
