import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getProfilesWithName } from '../../../../api-lib/findProfile';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { isValidENS } from '../../../../api-lib/validateENS';
import { zWebsite } from '../../../../src/lib/zod/formHelpers';

const updateProfileSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
    bio: z.string().optional(),
    description: z.string().optional(),
    skills: z.string().optional(),
    twitter_username: z.string().optional(),
    github_username: z.string().optional(),
    telegram_username: z.string().optional(),
    discord_username: z.string().optional(),
    medium_username: z.string().optional(),
    website: zWebsite,
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session, payload } = await getInput(req, updateProfileSchemaInput);
  const { name } = payload;

  // convert empty string website to null for db validation
  if (payload.website === '') {
    payload.website = null;
  }

  if (name.endsWith('.eth')) {
    const validENS = await isValidENS(name, session.hasuraAddress);
    if (!validENS)
      return errorResponseWithStatusCode(
        res,
        {
          message: `The ENS ${name} doesn't resolve to your current address: ${session.hasuraAddress}.`,
        },
        422
      );
  }
  const profile = await getProfilesWithName(name);
  if (
    profile &&
    profile.address.toLocaleLowerCase() !==
      session.hasuraAddress.toLocaleLowerCase()
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
          pk_columns: { id: session.hasuraProfileId },
          _set: { ...payload },
        },
        { id: true },
      ],
    },
    { operationName: 'updateProfile_by_pk' }
  );

  const returnResult = mutationResult.update_profiles_by_pk?.id;
  assert(returnResult, 'No return from mutation');

  res.status(200).json(mutationResult.update_profiles_by_pk);
  return;
}
