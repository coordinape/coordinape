/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'discord_users', 'INSERT'> = req.body;

    const linked = await handleDiscordUserAdded(payload);
    res
      .status(200)
      .json({ message: `Discord user ${linked ? 'linked' : 'not linked'}` });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}

function handleDiscordUserAdded(payload: any): Promise<boolean> {
  console.log({ fn: 'handleDiscordUserAdded', payload });
  return Promise.resolve(true);
}
