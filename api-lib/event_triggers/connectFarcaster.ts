import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../config.ts';
import { autoConnectFarcasterAccount } from '../farcaster/autoConnectFarcasterAccount.ts';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (IS_LOCAL_ENV) {
    return res
      .status(200)
      .json({ message: 'This endpoint is disabled in local environment.' });
  }
  try {
    const payload: EventTriggerPayload<'profiles', 'INSERT'> = req.body;
    const insertedProfile = payload.event.data.new;

    const fcProfile = await autoConnectFarcasterAccount(
      insertedProfile.address,
      insertedProfile.id
    );

    if (!fcProfile) {
      return res.status(200).json({
        message: `farcaster account not found for ${insertedProfile.address}`,
      });
    }
    res.status(200).json({
      message: `farcaster account @${fcProfile.username} connected to ${insertedProfile.address}`,
    });
  } catch (e) {
    res.status(500).json({
      error: '500',
      message: (e as Error).message || 'Unexpected error',
    });
  }
}
