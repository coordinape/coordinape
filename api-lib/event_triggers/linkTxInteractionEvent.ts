import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../gql/adminClient';
import * as mutations from '../gql/mutations';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: {
            buy,
            created_at,
            eth_amount,
            holder,
            link_amount,
            protocol_fee_amount,
            supply,
            target,
            target_fee_amount,
            tx_hash,
          },
        },
      },
    }: EventTriggerPayload<'link_tx', 'INSERT'> = req.body;

    await mutations.insertInteractionEvents({
      event_type: 'link_tx',
      profile_id: await getHolderProfileId(holder),
      event_subtype: buy ? 'buy' : 'sell',
      data: {
        created_at: created_at,
        buy: buy,
        eth_amount: eth_amount,
        holder: holder,
        link_amount: link_amount,
        protocol_fee_amount: protocol_fee_amount,
        supply: supply,
        target: target,
        target_fee_amount: target_fee_amount,
        tx_hash: tx_hash,
      },
    });

    res.status(200).json({
      message: `link_tx interaction event recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}

export const getHolderProfileId = async (
  address: string
): Promise<number | undefined> => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: { address: { _eq: address } },
          limit: 1,
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'link_tx_getHolderProfileId',
    }
  );

  return profiles.pop()?.id;
};
