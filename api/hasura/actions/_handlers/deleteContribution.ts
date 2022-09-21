import type { VercelRequest, VercelResponse } from '@vercel/node';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  deleteContributionInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

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
