import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  getFrameImgUrl,
  getFrameUrl,
} from '../../_api/webhooks/neynar_mention';
import { errorResponse } from '../HttpError';
import { publishCast } from '../neynar';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { event }: EventTriggerPayload<'colinks_gives', 'INSERT'> = req.body;
    if (event.data?.new) {
      return handleInsert(event.data.new, res);
    } else {
      console.error('Unexpected invocation', event.data);
    }
  } catch (e) {
    return errorResponse(res, e);
  }
}

const handleInsert = async (
  newRow: EventTriggerPayload<
    'colinks_gives',
    'INSERT'
  >['event']['data']['new'],
  res: VercelResponse
) => {
  const { cast_hash, id } = newRow;

  let msg;
  if (cast_hash) {
    await publishCastGiveDelivered(cast_hash, id, true);
    msg = `published GIVE Delivered for cast ${cast_hash} and give ${id}`;
  } else {
    msg = `no cast_hash for give ${id}`;
  }

  res.status(200).json({
    message: msg,
  });
};

export const publishCastGiveDelivered = async (
  hash: string,
  giveId: number,
  precache = true
) => {
  if (precache) {
    // PRE-CACHE farme and image by calling the URL
    await fetch(getFrameUrl('give', giveId), {
      signal: AbortSignal.timeout(10000),
    });
    await fetch(getFrameImgUrl('give', giveId), {
      signal: AbortSignal.timeout(10000),
    });
  }

  // TODO: change this to no message
  await publishCast(`GIVE Delivered`, {
    replyTo: hash,
    embeds: [{ url: getFrameUrl('give', giveId) }],
  });
};
