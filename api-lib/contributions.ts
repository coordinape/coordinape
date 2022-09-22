import type { VercelResponse } from '@vercel/node';

import { adminClient } from './gql/adminClient';
import { errorResponseWithStatusCode } from './HttpError';

export async function fetchAndVerifyContribution({
  res,
  id,
  userAddress,
  operationName,
}: {
  res: VercelResponse;
  id: number;
  userAddress: string;
  operationName: string;
}) {
  const { contributions_by_pk: contribution } = await adminClient.query(
    {
      contributions_by_pk: [
        { id },
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
    { operationName: `${operationName}_getContributionDetails` }
  );

  if (
    !contribution ||
    contribution.deleted_at ||
    contribution.user?.address !== userAddress
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
      { message: 'contribution in an ended epoch is not editable' },
      422
    );
    return;
  }

  return contribution;
}
