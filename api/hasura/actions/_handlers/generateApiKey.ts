import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../../../../api-lib/authHelpers';
import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { getUserFromProfileId } from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { ForbiddenError } from '../../../../api-lib/HttpError';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  generateApiKeyInputSchema,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBodyWithSession(
    generateApiKeyInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { hasuraProfileId } = sessionVariables;
  const { id: userId } = await getUserFromProfileId(
    hasuraProfileId,
    input.circle_id
  );
  if (!userId) throw new ForbiddenError('User does not belong to circle');

  const apiKey = generateTokenString();
  const hash = hashTokenString(apiKey);

  await adminClient.mutate(
    {
      insert_circle_api_keys_one: [
        { object: { ...input, hash, created_by: userId } },
        { hash: true },
      ],
    },
    {
      operationName: 'generateApiKey',
    }
  );

  return res.status(200).json({
    api_key: formatAuthHeader('api', apiKey),
    hash,
  });
}

export default authCircleAdminMiddleware(handler);
