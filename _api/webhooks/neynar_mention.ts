/* eslint-disable no-console */
import type { VercelRequest, VercelResponse } from '@vercel/node';

import { IS_LOCAL_ENV } from '../../api-lib/config';
import { insertInteractionEvents } from '../../api-lib/gql/mutations';
import { errorResponse } from '../../api-lib/HttpError';
import { publishCast } from '../../api-lib/neynar';
import { findOrCreateProfileByFid } from '../../api-lib/neynar/findOrCreateProfileByFid.ts';
import { isValidSignature } from '../../api-lib/neynarSignature';
import { botReply } from '../../api-lib/openai';
import {
  checkPointsAndCreateGive,
  fetchPoints,
} from '../hasura/actions/_handlers/createCoLinksGive';

const BOT_FID = 389267;
const DO_NOT_REPLY_FIDS = [BOT_FID];
const NOT_ENOUGH_GIVE_TEXT =
  "Unfortunately, you do not have enough give. You'll need to wait a bit before you can give again.";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // if localhost don't validate signature
    if (!IS_LOCAL_ENV) {
      if (!(await isValidSignature(req))) {
        res.status(401).send('Webhook signature not valid');
        return;
      }
    }

    const {
      data: {
        hash,
        parent_author: { fid: parent_fid },
        parent_hash,
        mentioned_profiles,
        text,
        author: { fid: author_fid, username: author_username },
      },
    } = req.body;

    const giver_profile = await findOrCreateProfileByFid(author_fid);

    // Don't reply to the bot itself
    if (DO_NOT_REPLY_FIDS.find(f => f == parent_fid)) {
      res.status(200).send({ success: true });
      return;
    }

    const mentioned_fid = mentioned_profiles.find(
      (f: { fid: number }) => f.fid !== BOT_FID
    )?.fid;

    let receiver_profile;
    if (parent_hash && parent_fid) {
      // Cast is a reply
      receiver_profile = await findOrCreateProfileByFid(parent_fid);
    } else if (mentioned_fid) {
      // Cast is not a reply - look for a mention
      receiver_profile = await findOrCreateProfileByFid(mentioned_fid);
    } else {
      // no parent hash or fid
      console.log('No parent hash or mentioned fid');
      await publishCast(
        `@${author_username} Please reply to a cast, or mention a user to direct your GIVE.`,
        {
          replyTo: hash,
        }
      );
      res.status(200).send({ success: true });
      return;
    }

    if (receiver_profile.id === giver_profile.id) {
      await publishCast(`@${author_username} You can't give to yourself.`, {
        replyTo: hash,
      });
      res.status(200).send({ success: true });
      return;
    }

    // giver has enough give points
    const { canGive } = await fetchPoints(giver_profile.id);
    if (!canGive) {
      await publishCast(`@${author_username} ${NOT_ENOUGH_GIVE_TEXT}`, {
        replyTo: hash,
      });

      res.status(200).send({ success: true });
      return;
    }

    const skill = parseSkill(text);

    await insertCoLinksGive(giver_profile, receiver_profile, hash, skill);

    const reply = await botReply(text);

    await publishCast(`@${author_username} ${reply}`, {
      replyTo: hash,
      embeds: [{ url: 'https://frames.neynar.com/f/48785bd7/d154488b' }],
    });

    return res.status(200).send({ success: true });
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

const insertCoLinksGive = async (
  giver_profile: any,
  receiver_profile: any,
  hash: string,
  skill?: string
) => {
  const { newPoints } = await checkPointsAndCreateGive(
    giver_profile.id,
    receiver_profile.id,
    {
      cast_hash: hash,
      skill: skill,
    }
  );

  await insertInteractionEvents({
    event_type: 'colinks_give_create',
    profile_id: giver_profile.id,
    data: {
      hostname: 'farcaster_bot',
      cast_hash: hash,
      new_points_balance: newPoints,
    },
  });
};

const parseSkill = (text: string) => {
  const skillMatch = text.match(/#(\w+)/);
  return skillMatch ? skillMatch[1] : undefined;
};
