import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
  updateContributionInput,
} from '../../../../src/lib/zod';

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
