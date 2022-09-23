import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
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

  const { id, description, datetime_created } = payload;

  const contribution = await fetchAndVerifyContribution({
    id,
    res,
    userAddress,
    operationName: actionName,
  });

  if (!contribution) return;

  if (
    datetime_created <
    DateTime.fromISO(
      contribution.circle.epochs_aggregate.aggregate?.max?.end_date
    )
  ) {
    errorResponseWithStatusCode(
      res,
      { message: 'cannot reassign contribution to a closed epoch' },
      422
    );
    return;
  }

  const mutationResult = await adminClient.mutate(
    {
      update_contributions_by_pk: [
        {
          pk_columns: { id },
          _set: {
            description,
            datetime_created: datetime_created.toISO(),
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
