import type { VercelRequest, VercelResponse } from '@vercel/node';

<<<<<<< HEAD
import { fetchAndVerifyContribution } from '../../../../api-lib/contributions';
import { adminClient } from '../../../../api-lib/gql/adminClient';
=======
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
>>>>>>> bab1da13 (Merge main branch into members-page-updates for icons (#1368))
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import {
  deleteContributionInput,
  composeHasuraActionRequestBodyWithSession,
  HasuraUserSessionVariables,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
<<<<<<< HEAD
    action: { name: actionName },
    session_variables: { hasuraAddress: userAddress },
=======
    session_variables: { hasuraAddress: address },
>>>>>>> bab1da13 (Merge main branch into members-page-updates for icons (#1368))
    input: { payload },
  } = composeHasuraActionRequestBodyWithSession(
    deleteContributionInput,
    HasuraUserSessionVariables
  ).parse(req.body);

  const { contribution_id } = payload;
<<<<<<< HEAD

  const contribution = await fetchAndVerifyContribution({
    res,
    userAddress,
    id: contribution_id,
    operationName: actionName,
  });

  if (!contribution) return;
=======
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
>>>>>>> bab1da13 (Merge main branch into members-page-updates for icons (#1368))

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
