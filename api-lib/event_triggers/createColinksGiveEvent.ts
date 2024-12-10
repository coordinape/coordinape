import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import {
  getFrameImgUrl,
  getFrameUrl,
} from '../../_api/webhooks/neynar_mention';
import { generateGiveImg } from '../../src/features/ai/replicate';
import { uploadURLToCloudflare } from '../../src/features/cloudflare/uploadURLToCloudflare';
import { adminClient } from '../gql/adminClient';
import { errorResponse } from '../HttpError';
import { generateWarpCastUrl, publishCast } from '../neynar';
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
  const { cast_hash, id, skill } = newRow;

  await genGiveImage(id);

  let msg;
  if (cast_hash) {
    await publishCastGiveDelivered(cast_hash, id, skill, true);
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
  skill: string,
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

  const { colinks_gives_by_pk } = await adminClient.query(
    {
      colinks_gives_by_pk: [
        { id: giveId },
        {
          target_profile_public: {
            farcaster_account: {
              username: true,
            },
          },
        },
      ],
    },
    { operationName: 'colinksGiveEvent__getProfileNames' }
  );

  const fcUserName =
    colinks_gives_by_pk?.target_profile_public?.farcaster_account?.username;

  const baseMessage = fcUserName
    ? `GIVE Delivered to @${fcUserName}`
    : `GIVE Delivered`;

  const giveMessage = skill ? `${baseMessage} for #${skill}` : baseMessage;

  const resp = await publishCast(giveMessage, {
    replyTo: hash,
    embeds: [{ url: getFrameUrl('give', giveId) }],
  });

  // update warpcast_url on give with bot response hash
  try {
    if (resp) {
      const warpcastUrl = await generateWarpCastUrl(resp.hash);

      await adminClient.mutate(
        {
          update_colinks_gives_by_pk: [
            {
              pk_columns: { id: giveId },
              _set: {
                warpcast_url: warpcastUrl,
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'updateGives_with_warpcast_url',
        }
      );
    }
  } catch (e: any) {
    console.error('Failed to generate and set warpcast_url:', e);
  }
};

const genGiveImage = async (id: number) => {
  const { colinks_gives_by_pk } = await adminClient.query(
    {
      colinks_gives_by_pk: [
        { id: id },
        {
          skill: true,
        },
      ],
    },
    { operationName: 'colinksGiveEvent__getProfileNames' }
  );

  const replicateImageUrl = await generateGiveImg({
    skill: colinks_gives_by_pk?.skill,
  });

  assert(replicateImageUrl, 'No image URL returned from AI');
  const url = await uploadURLToCloudflare(replicateImageUrl, '/frame');

  const { update_colinks_gives_by_pk } = await adminClient.mutate(
    {
      update_colinks_gives_by_pk: [
        {
          pk_columns: { id: id },
          _set: { image_url: url },
        },
        { __typename: true },
      ],
    },
    { operationName: 'updateGiveImageUrl' }
  );

  assert(update_colinks_gives_by_pk, 'No update_colinks_gives_by_pk returned');
  return { url, update_colinks_gives_by_pk };
};
