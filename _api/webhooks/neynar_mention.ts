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
import { checkPointsAndCreateGive } from '../hasura/actions/_handlers/createCoLinksGive';

const FC_BOT_CONNECTOR = 'farcaster-bot-created';
const DO_NOT_REPLY_FIDS = [389267];
const INITIAL_POINTS = MAX_POINTS_CAP * 0.6;

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
      author_eth_addresses
    );

    // Don't reply to the bot itself
    if (DO_NOT_REPLY_FIDS.find(parent_fid)) {
      res.status(200).send({ success: true });
      return;
    }

    if (parent_hash && parent_fid) {
      console.log('This is a reply to ', parent_hash, 'by', parent_fid);
      const receiver_profile = await receiverProfile(parent_fid);
      console.log('Receiver profile', receiver_profile);
      await insertCoLinksGive(giver_profile, receiver_profile, hash);
    } else {
      // no parent hash or fid
      //TODO: check for mentions to other profiles as receiver
      console.log('No parent hash or fid; no-op');
      res.status(200).send({ success: true });
      return;
    }

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
          // order_by: { }
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
  eth_addresses: string[]
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

    return await createProfile(address);
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

    return await createProfile(address);
  }
};

const createProfile = async (address: string) => {
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address,
            connector: FC_BOT_CONNECTOR,
            points_balance: INITIAL_POINTS,
            name: `New User ${address.substring(0, 8)}`, // not sure how to set this to FC name without having to handle the case that that name is already persent in our db
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
  hash: string
) => {
  const { newPoints } = await checkPointsAndCreateGive(
    giver_profile.id,
    receiver_profile.id,
    {
      cast_hash: hash,
      // TODO: set a skill???? skill: 'farcasting',
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
