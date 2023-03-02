import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getProfilesWithName } from '../../../../api-lib/findProfile';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { isValidENS } from '../../../../api-lib/validateENS';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

export const updateProfileSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
    bio: z.string().optional(),
    skills: z.string().optional(),
    twitter_username: z.string().optional(),
    github_username: z.string().optional(),
    telegram_username: z.string().optional(),
    discord_username: z.string().optional(),
    medium_username: z.string().optional(),
    website: z.string().optional().nullable(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    updateProfileSchemaInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { name } = payload;

  if (name.endsWith('.eth')) {
    const validENS = await isValidENS(name, session_variables.hasuraAddress);
    if (!validENS)
      return errorResponseWithStatusCode(
        res,
        {
          message: `The ENS ${name} doesn't resolve to your current address: ${session_variables.hasuraAddress}.`,
        },
        422
      );
  }
  const profile = await getProfilesWithName(name);
  if (
    profile &&
    profile.address.toLocaleLowerCase() !==
      session_variables.hasuraAddress.toLocaleLowerCase()
  ) {
    return errorResponseWithStatusCode(
      res,
      { message: 'This name is already in use' },
      422
    );
  }

  const mutationResult = await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: session_variables.hasuraProfileId },
          _set: { ...payload },
        },
        { id: true },
      ],
    },
    { operationName: 'updateProfile' }
  );

  const returnResult = mutationResult.update_profiles_by_pk?.id;
  assert(returnResult, 'No return from mutation');

  res.status(200).json(mutationResult.update_profiles_by_pk);
  return;
}

export default verifyHasuraRequestMiddleware(handler);
