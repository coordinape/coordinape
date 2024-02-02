import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  formatAuthHeader,
  generateTokenString,
  hashTokenString,
} from '../../../../api-lib/authHelpers';
import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { getUserFromProfileId } from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { ForbiddenError } from '../../../../api-lib/HttpError';

const generateApiKeyInputSchema = z
  .object({
    name: z.string().min(3).max(255),
    circle_id: z.number().int().positive(),
    read_circle: z.boolean().optional(),
    update_circle: z.boolean().optional(),
    read_nominees: z.boolean().optional(),
    create_vouches: z.boolean().optional(),
    read_pending_token_gifts: z.boolean().optional(),
    update_pending_token_gifts: z.boolean().optional(),
    read_member_profiles: z.boolean().optional(),
    read_epochs: z.boolean().optional(),
    read_contributions: z.boolean().optional(),
    create_contributions: z.boolean().optional(),
    read_discord: z.boolean().optional(),
    manage_users: z.boolean().optional(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, generateApiKeyInputSchema);

  const { id: userId } = await getUserFromProfileId(
    session.hasuraProfileId,
    payload.circle_id
  );
  if (!userId) throw new ForbiddenError('User does not belong to circle');

  const apiKey = generateTokenString();
  const hash = hashTokenString(apiKey);

  await adminClient.mutate(
    {
      insert_circle_api_keys_one: [
        { object: { ...payload, hash, created_by: userId } },
        { hash: true },
      ],
    },
    { operationName: 'generateApiKey' }
  );

  return res.status(200).json({
    api_key: formatAuthHeader('api', apiKey),
    hash,
  });
}

export default authCircleAdminMiddleware(handler);
