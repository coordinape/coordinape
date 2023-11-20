import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session } = await getInput(req);

  try {
    // get the similar users
    const address = session.hasuraAddress;

    const { shared_nfts } = await adminClient.query(
      {
        shared_nfts: [
          {
            where: {
              address: {
                _eq: address,
              },
            },
            limit: 20,
            order_by: [{ shared_count: order_by.desc }],
          },
          {
            // : true,
            other_address: true,
            shared_count: true,
          },
        ],
      },
      {
        operationName: 'getSimilarProfile',
      }
    );

    return res.status(200).json(
      shared_nfts.map(n => ({
        other_address: n.other_address,
        score: n.shared_count,
      }))
    );
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}
