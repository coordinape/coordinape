import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EventTriggerPayload } from '../types';

import handleCheckNomineeMsg from './utils/handleCheckNomineeMsg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload = req.body;
    const sent = await handleCheckNomineeMsg(payload, { telegram: true });
    res
      .status(200)
      .json({ message: `Telegram message ${sent ? 'sent' : 'not sent'}` });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
