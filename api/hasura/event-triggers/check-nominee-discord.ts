import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EventTriggerPayload } from '../types';

import handleCheckNomineeMsg from './utils/handleCheckNomineeMsg';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload = req.body;
    const sent = await handleCheckNomineeMsg(payload, { discord: true });
    res
      .status(200)
      .json({ message: `Discord message ${sent ? 'sent' : 'not sent'}` });
  } catch (e) {
    res.status(401).json({
      error: '401',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
