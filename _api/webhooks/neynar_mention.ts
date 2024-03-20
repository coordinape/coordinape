/* eslint-disable no-console */
import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getGiveBotInviterProfileId } from '../../api-lib/colinks/helperAccounts';
import { IS_LOCAL_ENV } from '../../api-lib/config';
import { adminClient } from '../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../api-lib/gql/mutations';
import { errorResponse } from '../../api-lib/HttpError';
import { fetchUserByFid, publishCast } from '../../api-lib/neynar';
import { isValidSignature } from '../../api-lib/neynarSignature';
import { botReply } from '../../api-lib/openai';
import { MAX_POINTS_CAP } from '../../src/features/points/getAvailablePoints';
import {
  checkPointsAndCreateGive,
  fetchPoints,
} from '../hasura/actions/_handlers/createCoLinksGive';

const FC_BOT_CONNECTOR = 'farcaster-bot-created';
const BOT_FID = 389267;
const DO_NOT_REPLY_FIDS = [BOT_FID];
const INITIAL_POINTS = MAX_POINTS_CAP * 0.6;
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
        author: {
          username: author_username,
          custody_address: author_custody_address,
          verified_addresses: { eth_addresses: author_eth_addresses },
        },
      },
    } = req.body;

    const giver_profile = await giverProfile(
      author_custody_address,
      author_eth_addresses,
      author_username
    );

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
      console.log('This is a reply to ', parent_hash, 'by', parent_fid);
      receiver_profile = await receiverProfile(parent_fid);
      console.log('Receiver profile', receiver_profile);
    } else if (mentioned_fid) {
      // Cast is not a reply - look for a mention
      console.log({ mentioned_profiles });
      receiver_profile = await receiverProfile(mentioned_fid);
    } else {
      // no parent hash or fid
      console.log('No parent hash or mentioned fid; no-op');
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

const findProfileByAddresses = async (addresses: string[]) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _in: addresses },
          },
        },
        {
          address: true,
          id: true,
          cosoul: {
            id: true,
          },
          links: true,
          links_held: true,
        },
      ],
    },
    {
      operationName: 'neynar_mention__findProfileByAddresses',
    }
  );
  return profiles.pop();
};

const giverProfile = async (
  custody_address: string,
  eth_addresses: string[],
  username: string
) => {
  const potential_addresses = [...eth_addresses, custody_address];

  const giver_profile = await findProfileByAddresses(potential_addresses);

  if (giver_profile) {
    return giver_profile;
  } else {
    console.log('No giver profile found for addresses', potential_addresses);
    const address = potential_addresses.pop();
    console.log('Creating new profile for giver with addr', address);
    assert(address, 'panic: no address to create profile for');

    return await createProfile(address, username);
  }
};

const receiverProfile = async (fid: number) => {
  const receiver = await fetchUserByFid(fid);

  const potential_addresses = [
    receiver.custody_address,
    ...receiver.verified_addresses.eth_addresses,
  ];
  const receiver_profile = await findProfileByAddresses(potential_addresses);

  if (receiver_profile) {
    return receiver_profile;
  } else {
    console.log('No receiver profile found for addresses', potential_addresses);
    const address = potential_addresses.pop();
    console.log('Creating new profile for receiver with addr', address);
    assert(address, 'panic: no address to create profile for');

    return await createProfile(address, receiver.username);
  }
};

const createProfile = async (address: string, preferred_name: string) => {
  // verify username is not in use
  const name = preferred_name;

  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            name: { _eq: preferred_name },
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'neynar_mention__checkProfileName',
    }
  );
  if (profiles.length > 0) {
    console.log('Preferred name already in use', preferred_name);

    const name = `${preferred_name} ${address.substring(0, 8)}`;
    console.log('Creating new profile with name', name);
  }

  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address,
            connector: FC_BOT_CONNECTOR,
            points_balance: INITIAL_POINTS,
            name: name,
            invited_by: await getGiveBotInviterProfileId(),
          },
        },
        {
          id: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'neynar_mention__createProfile',
    }
  );
  assert(insert_profiles_one, "panic: adding profile didn't succeed");
  return insert_profiles_one;
};

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
