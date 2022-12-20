import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { getProfilesWithName } from '../../../../api-lib/findProfile';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

export const updateProfileNameSchemaInput = z
  .object({
    name: z.string().min(3).max(255),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    updateProfileNameSchemaInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { name } = payload;

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
          _set: { name },
        },
        { id: true },
      ],
    },
    { operationName: 'updateProfileName' }
  );

  const returnResult = mutationResult.update_profiles_by_pk?.id;
  assert(returnResult, 'No return from mutation');

  res.status(200).json(mutationResult.update_profiles_by_pk);
  return;
}

export default handler;
