import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  discord_users_constraint,
  discord_users_update_column,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../api-lib/validate';
import {
  linkDiscordInputSchema,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    linkDiscordInputSchema,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { discord_id } = payload;
  const { hasuraProfileId: profile_id } = session_variables;

  // no validation here; It's the caller's responsibility to pass in
  // a valid snowflake
  const result = await adminClient.mutate({
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
  });
  assert(result.insert_discord_users_one, 'panic: Unexpected GQL response');
  const returnResult = result.insert_discord_users_one;

  res.status(200).json(returnResult);
  return;
}

export default verifyHasuraRequestMiddleware(handler);
