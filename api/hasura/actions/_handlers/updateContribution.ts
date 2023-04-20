import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
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
    action,
    session: { hasuraAddress: userAddress },
    payload: { id, description },
  } = getInput(req, updateContributionInput);

  const contribution = await fetchAndVerifyContribution({
    id,
    res,
    userAddress,
    operationName: action.name,
  });

  if (!contribution) return;

  const mutationResult = await adminClient.mutate(
    {
      update_contributions_by_pk: [
        { pk_columns: { id }, _set: { description } },
        { id: true },
      ],
    },
    { operationName: 'updateContribution_update' }
  );

  return res.status(200).json(mutationResult.update_contributions_by_pk);
}

export default verifyHasuraRequestMiddleware(handler);
