import type { VercelRequest, VercelResponse } from '@vercel/node';

import { updateRepScoreForAddress } from '../../src/features/rep/api/updateRepScore';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<
      'cosouls',
      'INSERT' | 'DELETE' | 'UPDATE'
    > = req.body;
    const address: string =
      payload.event.data.new?.address ?? payload.event.data.old?.address;

    await updateRepScoreForAddress(address);

    res.status(200).json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
