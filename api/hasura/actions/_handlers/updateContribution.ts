import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../api-lib/requests/schema';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

export const updateContributionInput = z
  .object({
    // this should probably be handled as a bigint
    id: z.number().int().positive(),
    description: z.string().nonempty(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    action: { name: actionName },
    session_variables: { hasuraAddress: userAddress },
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    updateContributionInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { id, description } = payload;

  const contribution = await fetchAndVerifyContribution({
    id,
    res,
    userAddress,
    operationName: actionName,
  });

  if (!contribution) return;

  const mutationResult = await adminClient.mutate(
    {
      update_contributions_by_pk: [
        {
          pk_columns: { id },
          _set: {
            description,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'updateContribution_update' }
  );

  return res.status(200).json(mutationResult.update_contributions_by_pk);
}

export default verifyHasuraRequestMiddleware(handler);
