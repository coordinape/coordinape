import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse, InternalServerError } from '../../api-lib/HttpError.ts';
import { fetchFollowers, fetchUserByAddress } from '../../api-lib/neynar.ts';

type NetworkNode = {
  username: string;
  avatar: string;
  profile_id?: number;
  farcaster_id: number;
  tier: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let address: string | undefined;
  if (typeof req.query.address == 'string') {
    address = req.query.address;
  } else if (Array.isArray(req.query.address)) {
    address = req.query.address.pop();
  }

  assert(address, 'no address provided');

  // lets try to figure out the user based on address
  const { targetProfiles } = await adminClient.query(
    {
      __alias: {
        targetProfiles: {
          profiles: [
            {
              where: {
                address: { _eq: address },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
              farcaster_account: {
                fid: true,
              },
            },
          ],
        },
      },
    },
    {
      operationName: 'getNetwork__getTargetProfileByAddress',
    }
  );
  const targetProfile = targetProfiles.pop();

  let fUser = undefined;
  if (!targetProfile) {
    // they don't have a colinks account
    // we have to use farcaster to find them

    fUser = await fetchUserByAddress(address);
  }

  if (!targetProfile && !fUser) {
    return errorResponse(
      res,
      'no CoLinks or Farcaster user found for this address'
    );
  }

  if (targetProfile) {
    // TODO: hook this up
    await getCoSoulStuff(targetProfile.id);
  }

  // TODO: mash all the data together
  let nodes: NetworkNode[] = [];
  const fid = targetProfile?.farcaster_account?.fid ?? fUser?.fid;
  if (fid) {
    nodes = await getFollowerNodes(fid);
  }

  try {
    return res.status(200).json({ nodes });
  } catch (e) {
    throw new InternalServerError('Unable to fetch info from guild', e);
  }
}

const getFollowerNodes = async (fid: number) => {
  const ff = await fetchFollowers(fid);
  const followers = ff.users.map(user => {
    const nn: NetworkNode = {
      username: user.username,
      avatar: user.pfp.url,
      // TODO: fill this in later i guess
      // profile_id: user.id,
      farcaster_id: user.fid,
      tier: 1,
    };
    return nn;
  });
  return followers;
};

// TODO: this doesn't really do anything yet
const getCoSoulStuff = async (targetProfileId: number) => {
  // get all their links!
  await adminClient.query(
    {
      profiles_public: [
        {
          where: {
            id: { _eq: targetProfileId },
          },
        },
        {
          address: true,
          link_holder: [
            {},
            {
              holder: true,
              target: true,
              amount: true,
              target_cosoul: {
                address: true,
              },
            },
          ],
          link_target: [
            {},
            {
              holder: true,
              target: true,
              amount: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getNetwork__getColinks',
    }
  );
};