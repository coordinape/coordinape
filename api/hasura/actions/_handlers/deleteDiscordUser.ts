import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { authUserDeleterMiddleware } from '../../../../api-lib/userDeleter';
import {
  deletedDiscordUserInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(deletedDiscordUserInput).parse(req.body);

  const { user_snowflake } = payload;

  const { delete_discord_users } = await adminClient.mutate(
    {
      delete_discord_users: [
        {
          where: {
            user_snowflake: { _eq: user_snowflake },
          },
        },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'deleteUser_getExistingUser',
    }
  );
  assert(delete_discord_users);
  return res
    .status(200)
    .json({ success: delete_discord_users.affected_rows === 1 });
}

export default authUserDeleterMiddleware(handler);
