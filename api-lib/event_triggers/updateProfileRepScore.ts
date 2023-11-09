import type { VercelRequest, VercelResponse } from '@vercel/node';

import { updateRepScore } from '../../src/features/rep/api/updateRepScore';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<
      'twitter_accounts' | 'github_accounts' | 'linkedin_accounts' | 'emails',
      'INSERT' | 'DELETE' | 'UPDATE'
    > = req.body;
    const profileId: number =
      payload.event.data.new?.profile_id ?? payload.event.data.old?.profile_id;
    await updateRepScore(profileId);
    res.status(200).json({ message: 'ok' });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
