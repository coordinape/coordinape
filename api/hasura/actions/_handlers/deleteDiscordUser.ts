import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { composeHasuraActionRequestBody } from '../../../../api-lib/requests/schema';
import { authUserDeleterMiddleware } from '../../../../api-lib/userDeleter';

export const deleteDiscordUserInput = z
  .object({ user_snowflake: z.string() })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(deleteDiscordUserInput).parse(req.body);

  const { user_snowflake } = payload;

  const { delete_discord_users } = await adminClient.mutate(
    {
      delete_discord_users: [
        { where: { user_snowflake: { _eq: user_snowflake } } },
        { affected_rows: true },
      ],
    },
    { operationName: 'deleteUser_getExistingUser' }
  );
  assert(delete_discord_users);
  return res
    .status(200)
    .json({ success: delete_discord_users.affected_rows === 1 });
}

export default authUserDeleterMiddleware(handler);
