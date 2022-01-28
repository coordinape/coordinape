import type { VercelRequest, VercelResponse } from '@vercel/node';

import { gql } from '../../api-lib/Gql';

// TODO: remove this
/*

        $expired_nominees = $this->model->with('circle','nominations')->where('ended',0)->pastExpiryDate()->get();
        foreach($expired_nominees as $nominee) {
            $nominee->ended = 1;
            $nominee->save();
            $nominations = count($nominee->nominations);
            $nominee_name = Utils::cleanStr($nominee->name);
            $message = "Nominee $nominee_name has only received $nominations vouch(es) and has failed";
            $nominee->circle->notify(new SendSocialMessage($message, true));
        }

*/

async function sendSocialMessage({
  message,
  circleId,
}: {
  message: string;
  circleId: number;
}) {
  // TODO: discord + telegram webhook calls
  console.log('Circle id:', circleId, ' Message is: ', message);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { nominees } = await gql.q('query')({
      nominees: [
        {
          where: {
            ended: {
              _eq: false,
            },
            expiry_date: { _lte: new Date().toISOString() },
          },
        },
        {
          id: true,
          name: true,
          circle_id: true,
          nominations_aggregate: {
            aggregate: { count: true },
          },
        },
      ],
    });

    if (nominees.length > 0) {
      const { update_nominees } = await gql.q('mutation')({
        update_nominees: [
          {
            _set: {
              ended: true,
            },
            where: {
              id: {
                _in: nominees.map(n => n.id),
              },
            },
          },
          {
            affected_rows: true,
            returning: {
              name: true,
              expiry_date: true,
            },
          },
        ],
      });

      await Promise.all(
        nominees.map(n =>
          sendSocialMessage({
            message: `Nominee ${n.name} has only received ${n.nominations_aggregate.aggregate.count} vouch(es) and has failed`,
            circleId: n.circle_id,
          })
        )
      );
      res.status(200).json({ update_nominees });
      return;
    }

    res.status(200).json({ message: 'No updates' });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
