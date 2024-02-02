/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { errorResponseWithStatusCode } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const payload: EventTriggerPayload<'discord_users', 'INSERT'> = req.body;

    const linked = await handleDiscordUserAdded(payload);
    res
      .status(200)
      .json({ message: `Discord user ${linked ? 'linked' : 'not linked'}` });
  } catch (e) {
    return errorResponseWithStatusCode(
      res,
      { message: 'Unexpected error linking the user' },
      422
    );
  }
}

function handleDiscordUserAdded(payload: any): Promise<boolean> {
  console.log({ fn: 'handleDiscordUserAdded', payload });
  return Promise.resolve(true);
}
