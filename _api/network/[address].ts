import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAddress } from 'ethers/lib/utils';

import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse, InternalServerError } from '../../api-lib/HttpError.ts';
import { fetchUserByAddress } from '../../api-lib/neynar.ts';

const MUTUAL_FOLLOW_SCORE = 10000;
const MUTUAL_LINK_SCORE = 1000;
const GIVE_SENT_SCORE = 10;
const GIVE_RECEIVED_SCORE = 10;

type NetworkNode = {
  address: string;
  username: string;
  avatar?: string;
  tier: number;
  score: number;
  mutualFollows: boolean;
  mutualLinks: boolean;
  sentGiveTo: boolean;
  receivedGiveFrom: boolean;
  hasCoLinks: boolean;
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
                address: { _ilike: address },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
              address: true,
              farcaster_account: {
                fid: true,
                custody_address: true,
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

  const fcUser = await fetchUserByAddress(address);

  if (!targetProfile && !fcUser) {
    return errorResponse(
      res,
      'no CoLinks or Farcaster user found for this address'
    );
  }

  const nodes = await buildNetwork({
    address,
    profileId: targetProfile?.id,
    fid: fcUser?.fid,
  });

  try {
    return res.status(200).json({ profile: targetProfile, nodes });
  } catch (e) {
    throw new InternalServerError('Unable to gather network data', e);
  }
}

const getMutualFollowers = async (fid: number) => {
  const { farcaster_mutual_follows } = await adminClient.query(
    {
      farcaster_mutual_follows: [
        {
          where: {
            fid: { _eq: fid },
          },
          limit: 1000,
        },
        {
          target_fid: true,
          target_profile_with_address: {
            fname: true,
            // display_name: true,
            avatar_url: true,
            // bio: true,
            verified_addresses: [{}, true],
            fids: {
              custody_address: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'getNetwork__getMutualFollowers',
    }
  );

  assert(farcaster_mutual_follows, 'error fetching mutual followers');

  return farcaster_mutual_follows;
};

const getMutualLinks = async (address: string) => {
  const { mutual_link_holders } = await adminClient.query(
    {
      mutual_link_holders: [
        {
          where: {
            target: { _eq: address },
          },
          limit: 1000,
        },
        {
          holder_profile_public: {
            name: true,
            avatar: true,
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'getNetwork__getMutualFollowers',
    }
  );

  assert(mutual_link_holders, 'no mutual link holders found');

  return mutual_link_holders;
};

const getGiveNetwork = async (profileId: number) => {
  const { sentGiveTo, receivedGiveFrom } = await adminClient.query(
    {
      __alias: {
        sentGiveTo: {
          colinks_gives: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
              limit: 1000,
            },
            {
              target_profile_public: {
                name: true,
                avatar: true,
                address: true,
              },
            },
          ],
        },
        receivedGiveFrom: {
          colinks_gives: [
            {
              where: {
                target_profile_id: { _eq: profileId },
              },
              limit: 1000,
            },
            {
              giver_profile_public: {
                name: true,
                avatar: true,
                address: true,
              },
            },
          ],
        },
      },
    },
    { operationName: 'api_network__getGiveNetwork' }
  );

  return { sentGiveTo, receivedGiveFrom };
};

const buildNetwork = async ({
  profileId,
  address,
  fid,
}: {
  address: string;
  profileId?: number;
  fid?: number;
}): Promise<NetworkNode[]> => {
  if (!profileId && !fid) {
    return [];
  }

  const relations: Record<string, NetworkNode> = {};

  const getOrCreateNetworkNode = ({
    address,
    username,
    avatar,
  }: {
    address: string;
    username: string;
    avatar: string | undefined;
  }) => {
    const node: NetworkNode = (relations[address] = relations[address] ?? {
      address,
      username,
      avatar,
      tier: 0,
      score: 0,
      mutualLinks: false,
      sentGiveTo: false,
      receivedGiveFrom: false,
      hasCoLinks: false,
    });

    relations[address] = node;
    return node;
  };

  if (profileId) {
    const mutualLinks = await getMutualLinks(address);

    for (const link of mutualLinks) {
      const node = getOrCreateNetworkNode({
        address: link.holder_profile_public?.address ?? 'unknown',
        username: link.holder_profile_public?.name,
        avatar: link.holder_profile_public?.avatar,
      });
      node.mutualLinks = true;
      node.hasCoLinks = true; // TODO: might have a colinks and not be mutual, not inclusive
    }

    const { sentGiveTo, receivedGiveFrom } = await getGiveNetwork(profileId);

    for (const give of sentGiveTo) {
      const node = getOrCreateNetworkNode({
        address: give.target_profile_public?.address ?? 'unknown',
        username: give.target_profile_public?.name,
        avatar: give.target_profile_public?.avatar,
      });
      node.sentGiveTo = true;
    }

    for (const give of receivedGiveFrom) {
      const node = getOrCreateNetworkNode({
        address: give.giver_profile_public?.address ?? 'unknown',
        username: give.giver_profile_public?.name,
        avatar: give.giver_profile_public?.avatar,
      });
      node.receivedGiveFrom = true;
    }
  }

  if (fid) {
    const mutualFollowers = await getMutualFollowers(fid);

    for (const follower of mutualFollowers) {
      if (follower.target_profile_with_address) {
        const verifiedAddress =
          follower.target_profile_with_address.verified_addresses[0];

        const custodyAddress = hexToAddress(
          follower.target_profile_with_address.fids?.custody_address
        );

        const node = getOrCreateNetworkNode({
          address: verifiedAddress ?? custodyAddress,
          username: follower.target_profile_with_address.fname || 'unknown',
          avatar: follower.target_profile_with_address?.avatar_url,
        });
        node.mutualFollows = true;
      }
    }
  }

  return Object.values(relations)
    .map(node => {
      return { ...node, ...calcScore(node) };
    })
    .sort((a, b) => b.score - a.score);
};

const calcScore = (node: NetworkNode) => {
  let score = 0;

  if (node.mutualFollows) {
    score += MUTUAL_FOLLOW_SCORE;
  }

  if (node.mutualLinks) {
    score += MUTUAL_LINK_SCORE;
  }

  if (node.sentGiveTo) {
    score += GIVE_SENT_SCORE;
  }

  if (node.receivedGiveFrom) {
    score += GIVE_RECEIVED_SCORE;
  }

  return {
    score,
  };
};

function hexToAddress(hex: string) {
  // Remove the leading '\x'
  if (hex.startsWith('\\x')) {
    hex = hex.slice(2);
  }
  return getAddress('0x' + hex);
}
