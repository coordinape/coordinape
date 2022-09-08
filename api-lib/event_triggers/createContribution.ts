import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';
import { verifyHasuraRequestMiddleware } from '../validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    event: { data },
  }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

  const { epoch_id, user_id, id } = data.new;

  if (!epoch_id) {
    try {
      const { users_by_pk } = await adminClient.query(
        {
          users_by_pk: [
            {
              id: user_id,
            },
            {
              circle: {
                epochs: [
                  {
                    limit: 1,
                    where: {
                      start_date: {
                        _lte: 'now()',
                      },
                      end_date: {
                        _gt: 'now()',
                      },
                      ended: {
                        _eq: false,
                      },
                    },
                  },
                  {
                    id: true,
                  },
                ],
              },
            },
          ],
        },
        {
          operationName: 'createContribution_epochQuery',
        }
      );
      if (users_by_pk?.circle?.epochs[0]) {
        await adminClient.mutate(
          {
            update_contributions_by_pk: [
              {
                pk_columns: { id },
                _set: { epoch_id: users_by_pk.circle.epochs[0].id },
              },
              { __typename: true },
            ],
          },
          {
            operationName: 'createContribution_attachEpoch',
          }
        );
      }

      res.status(200).json({
        message: `contribution #${id} processed for epoch attachment`,
      });
      return;
    } catch (e) {
      errorResponse(res, e);
      return;
    }
  }
}

export default verifyHasuraRequestMiddleware(handler);
