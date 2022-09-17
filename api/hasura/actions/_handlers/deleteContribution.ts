import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  deleteContributionInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session_variables: { hasuraAddress: address },
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    deleteContributionInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { contribution_id } = payload;
  const { contributions_by_pk: contribution } = await adminClient.query(
    {
      contributions_by_pk: [
        { id: contribution_id },
        {
          datetime_created: true,
          deleted_at: true,
          circle: {
            epochs_aggregate: [
              { where: { ended: { _eq: true } } },
              { aggregate: { max: { end_date: true } } },
            ],
          },
          user: {
            address: true,
          },
        },
      ],
    },
    { operationName: 'deleteContribution_getContributionDetails' }
  );

  if (
    !contribution ||
    contribution.deleted_at ||
    contribution.user?.address !== address
  ) {
    errorResponseWithStatusCode(
      res,
      { message: 'contribution does not exist' },
      422
    );
    return;
  }

  if (
    contribution?.datetime_created <
    contribution?.circle.epochs_aggregate.aggregate?.max?.end_date
  ) {
    errorResponseWithStatusCode(
      res,
      { message: 'contribution attached to an ended epoch is not editable' },
      422
    );
    return;
  }

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
