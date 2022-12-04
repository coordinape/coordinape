import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getNominees } from '../../../../api-lib/findNominees';
import { getProfilesWithName } from '../../../../api-lib/findProfile';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import {
  updateProfileNameSchemaInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables,
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    updateProfileNameSchemaInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { name } = payload;

  const profile = await getProfilesWithName('updateProfileName', name);
  if (
    profile &&
    profile.address.toLocaleLowerCase() !==
      session_variables.hasuraAddress.toLocaleLowerCase()
  ) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `This name is used by another coordinape user`,
      },
      422
    );
  }

  const nominee = await getNominees('updateProfileName', name);
  if (nominee) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `This name is used by another coordinape user`,
      },
      422
    );
  }

  const mutationResult = await adminClient.mutate(
    {
      update_profiles_by_pk: [
        {
          pk_columns: { id: session_variables.hasuraProfileId },
          _set: {
            name: name,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateProfileName',
    }
  );

  const returnResult = mutationResult.update_profiles_by_pk?.id;
  assert(returnResult, 'No return from mutation');

  res.status(200).json(mutationResult.update_profiles_by_pk);
  return;
}

export default handler;
