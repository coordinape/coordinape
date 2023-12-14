import type { VercelRequest, VercelResponse } from '@vercel/node';

import { updateRepScoreForAddress } from '../../src/features/rep/api/updateRepScore';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<
      'link_holders',
      'INSERT' | 'DELETE' | 'UPDATE'
    > = req.body;
    const holder: string =
      payload.event.data.new?.holder ?? payload.event.data.old?.holder;
    const target: string =
      payload.event.data.new?.target ?? payload.event.data.old?.target;

    await updateRepScoreForAddress(holder);
    await updateRepScoreForAddress(target);

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
