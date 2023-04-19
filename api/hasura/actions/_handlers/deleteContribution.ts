import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../api-lib/requests/schema';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

const deleteContributionInput = z
  .object({
    contribution_id: z.number().int().positive(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    action: { name: actionName },
    session_variables: { hasuraAddress: userAddress },
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    deleteContributionInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { contribution_id } = payload;

  const contribution = await fetchAndVerifyContribution({
    res,
    userAddress,
    id: contribution_id,
    operationName: actionName,
  });

  if (!contribution) return;

  await adminClient.mutate(
    {
      update_contributions_by_pk: [
        { pk_columns: { id: contribution_id }, _set: { deleted_at: 'now()' } },
        { __typename: true },
      ],
    },
    { operationName: 'deleteContribution_delete' }
  );

  res.status(200).json({
    success: true,
  });
}

export default verifyHasuraRequestMiddleware(handler);
