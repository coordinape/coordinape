import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  discord_users_constraint,
  discord_users_update_column,
} from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';

const linkDiscordInputSchema = z.object({ discord_id: z.string() }).strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session, payload } = await getInput(req, linkDiscordInputSchema, {
    allowAdmin: true,
  });

  const { discord_id } = payload;
  const { hasuraProfileId: profile_id } = session;

  // no validation here; It's the caller's responsibility to pass in
  // a valid snowflake
  const result = await adminClient.mutate(
    {
      insert_discord_users_one: [
        {
          object: { user_snowflake: discord_id, profile_id },
          on_conflict: {
            constraint: discord_users_constraint.users_profile_id_key,
            update_columns: [discord_users_update_column.user_snowflake],
          },
        },
        { id: true },
      ],
    },
    { operationName: 'createDiscordUser' }
  );
  assert(result.insert_discord_users_one, 'panic: Unexpected GQL response');
  const returnResult = result.insert_discord_users_one;

  res.status(200).json(returnResult);
  return;
}
