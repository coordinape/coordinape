import type { VercelRequest, VercelResponse } from '@vercel/node';

import { autoConnectFarcasterAccount } from '../farcaster/autoConnectFarcasterAccount.ts';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'profiles', 'INSERT'> = req.body;
    const insertedUser = payload.event.data.new;

    const fcProfile = await autoConnectFarcasterAccount(
      insertedUser.address,
      insertedUser.id
    );
    res.status(200).json({
      message: `farcaster account @${fcProfile.username} connected to ${insertedUser.address}`,
    });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
