import type { VercelResponse } from '@vercel/node';

import { adminClient } from './gql/adminClient';
import { errorResponseWithStatusCode } from './HttpError';

export async function fetchAndVerifyContribution({
  res,
  id,
  profileId,
  operationName,
}: {
  res: VercelResponse;
  id: number;
  profileId: number;
  operationName: string;
}) {
  const { contributions_by_pk: contribution } = await adminClient.query(
    {
      contributions_by_pk: [
        { id },
        {
          created_at: true,
          deleted_at: true,
          circle: {
            epochs_aggregate: [
              { where: { ended: { _eq: true } } },
              { aggregate: { max: { end_date: true } } },
            ],
          },
          user: {
            profile_id: true,
          },
        },
      ],
    },
    { operationName: `${operationName}_getContributionDetails` }
  );

  if (
    !contribution ||
    contribution.deleted_at ||
    contribution.user?.profile_id !== profileId
  ) {
    errorResponseWithStatusCode(
      res,
      { message: 'contribution does not exist' },
      422
    );
    return;
  }

  return contribution;
}
