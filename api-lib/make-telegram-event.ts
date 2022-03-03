import type { VercelRequest, VercelResponse } from '@vercel/node';

import { GraphQLTypes } from '../src/lib/gql/zeusHasuraAdmin';

import { EventTriggerPayload, OperationTypes } from './types';

export default function makeTelegramEvent<
  X extends keyof GraphQLTypes,
  Y extends OperationTypes
>(
  msgHandler: (
    payload: EventTriggerPayload<X, Y>,
    channels: { discord?: boolean; telegram?: boolean }
  ) => Promise<boolean>
) {
  return async function handler(req: VercelRequest, res: VercelResponse) {
    try {
      const sent = await msgHandler(req.body, { telegram: true });
      res
        .status(200)
        .json({ message: `Telegram message ${sent ? 'sent' : 'not sent'}` });
    } catch (e) {
      res.status(500).json({
        error: '500',
        message: (e as Error).message || 'Unexpected error',
      });
    }
  };
}
