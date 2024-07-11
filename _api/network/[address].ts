import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAddress } from 'ethers/lib/utils';

import { colinks_gives_select_column } from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse, InternalServerError } from '../../api-lib/HttpError.ts';
import { fetchUserByAddress } from '../../api-lib/neynar.ts';

// missing:

const MAX_NODES_PER_CATEGORY = 50;

const FARCASTER_FOLLOWER_SCORE = 1;
const FARCASTER_FOLLOWS_SCORE = 10;
const FARCASTER_MUTUAL_FOLLOW_SCORE = 100;
const GIVE_SENT_TO_SCORE = 1000;
const GIVE_RECEIVED_FROM_SCORE = 1000;
// TODO: handle mutuals and both sides of link
const COLINKED_SCORE = 10000;

type NetworkNode = {
  address: string;
  username: string;
  avatar?: string;
  tier: number;
  score: number;
  mutualFollows: boolean;
  farcasterFollower: boolean;
  farcasterFollows: boolean;
  linkHolder: boolean;
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

  const network = await buildNetwork({
    address,
    profileId: targetProfile?.id,
    fid: fcUser?.fid,
  });

  try {
    return res.status(200).json({ profile: targetProfile, network });
  } catch (e) {
    throw new InternalServerError('Unable to gather network data', e);
  }
}

const getMutualFollowers = async (fid: number) => {
  const { farcaster_mutual_follows, farcaster_mutual_follows_aggregate } =
    await adminClient.query(
      {
        farcaster_mutual_follows: [
          {
            where: {
              fid: { _eq: fid },
            },
            limit: MAX_NODES_PER_CATEGORY,
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
        farcaster_mutual_follows_aggregate: [
          {
            where: {
              fid: { _eq: fid },
            },
          },
          {
            aggregate: {
              count: [{}, true],
            },
          },
        ],
      },
      {
        operationName: 'getNetwork__getMutualFollowers',
      }
    );

  return {
    farcaster_mutuals: farcaster_mutual_follows ?? [],
    farcaster_mutuals_count:
      farcaster_mutual_follows_aggregate?.aggregate?.count ?? 0,
  };
};

const getFarcasterFollowers = async (fid: number) => {
  const { farcaster_links, farcaster_links_aggregate } =
    await adminClient.query(
      {
        farcaster_links: [
          {
            where: {
              target_fid: { _eq: fid },
              deleted_at: { _is_null: true },
            },
            limit: MAX_NODES_PER_CATEGORY,
          },
          {
            target_fid: true,
            profile_with_address: {
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
        farcaster_links_aggregate: [
          {
            where: {
              target_fid: { _eq: fid },
              deleted_at: { _is_null: true },
            },
          },
          {
            aggregate: {
              count: [{}, true],
            },
          },
        ],
      },
      {
        operationName: 'getNetwork__getFarcasterFollowers',
      }
    );

  return {
    farcaster_followers: farcaster_links ?? [],
    farcaster_followers_count: farcaster_links_aggregate?.aggregate?.count ?? 0,
  };
};

const getFarcasterFollows = async (fid: number) => {
  const { farcaster_links, farcaster_links_aggregate } =
    await adminClient.query(
      {
        farcaster_links: [
          {
            where: {
              fid: { _eq: fid },
              deleted_at: { _is_null: true },
            },
            limit: MAX_NODES_PER_CATEGORY,
          },
          {
            fid: true,
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
        farcaster_links_aggregate: [
          {
            where: {
              fid: { _eq: fid },
              deleted_at: { _is_null: true },
            },
          },
          {
            aggregate: {
              count: [{}, true],
            },
          },
        ],
      },
      {
        operationName: 'getNetwork__getFarcasterFollows',
      }
    );

  return {
    farcaster_follows: farcaster_links ?? [],
    farcaster_follows_count: farcaster_links_aggregate?.aggregate?.count ?? 0,
  };
};

const getLinks = async (address: string) => {
  const { link_holders, link_holders_aggregate } = await adminClient.query(
    {
      link_holders: [
        {
          where: {
            _or: [{ target: { _eq: address } }, { holder: { _eq: address } }],
          },
          limit: MAX_NODES_PER_CATEGORY,
        },
        {
          holder_profile_public: {
            name: true,
            avatar: true,
            address: true,
          },
        },
      ],
      link_holders_aggregate: [
        {
          where: {
            _or: [{ target: { _eq: address } }, { holder: { _eq: address } }],
          },
        },
        {
          aggregate: {
            count: [{}, true],
          },
        },
      ],
    },
    {
      operationName: 'getNetwork__getLinks',
    }
  );

  return {
    link_holders: link_holders ?? [],
    link_holders_count: link_holders_aggregate?.aggregate?.count ?? 0,
  };
};

const getGiveNetwork = async (profileId: number) => {
  const { sentGiveTo, receivedGiveFrom, giverCounts } = await adminClient.query(
    {
      __alias: {
        giverCounts: {
          colinks_gives_aggregate: [
            {
              where: {
                _or: [
                  { profile_id: { _eq: profileId } },
                  { target_profile_id: { _eq: profileId } },
                ],
              },
              // TODO: This count is inflated if both gave to each other, not sure what to do yet
              distinct_on: [
                colinks_gives_select_column.profile_id,
                colinks_gives_select_column.target_profile_id,
              ],
            },
            {
              aggregate: {
                count: [{}, true],
              },
            },
          ],
        },
        sentGiveTo: {
          colinks_gives: [
            {
              where: {
                profile_id: { _eq: profileId },
              },
              distinct_on: [colinks_gives_select_column.target_profile_id],
              limit: MAX_NODES_PER_CATEGORY,
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
              distinct_on: [colinks_gives_select_column.profile_id],
              limit: MAX_NODES_PER_CATEGORY,
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

  return {
    sentGiveTo,
    receivedGiveFrom,
    giverCounts: giverCounts?.aggregate?.count ?? 0,
  };
};

const buildNetwork = async ({
  profileId,
  address,
  fid,
}: {
  address: string;
  profileId?: number;
  fid?: number;
}) => {
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

  const getNodeFromFarcasterProfile = (profile: {
    verified_addresses?: any;
    fids?: { custody_address: any };
    fname?: string;
    avatar_url?: string;
  }) => {
    const verifiedAddress = profile.verified_addresses[0];

    const custodyAddress = hexToAddress(profile.fids?.custody_address ?? '');

    const node = getOrCreateNetworkNode({
      address: verifiedAddress ?? custodyAddress,
      username: profile.fname || 'unknown',
      avatar: profile.avatar_url,
    });
    return node;
  };

  let link_holders_count = 0;
  let give_transferred_count = 0;
  if (profileId) {
    const { link_holders, link_holders_count: lhc } = await getLinks(address);

    link_holders_count = lhc;

    for (const link of link_holders) {
      const node = getOrCreateNetworkNode({
        address: link.holder_profile_public?.address ?? 'unknown',
        username: link.holder_profile_public?.name,
        avatar: link.holder_profile_public?.avatar,
      });
      node.linkHolder = true;
      node.hasCoLinks = true; // TODO: might have a colinks and not be mutual, not inclusive
    }

    const { sentGiveTo, receivedGiveFrom, giverCounts } =
      await getGiveNetwork(profileId);

    give_transferred_count = giverCounts;
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

  let farcaster_mutuals_count,
    farcaster_followers_count,
    farcaster_follows_count = 0;

  if (fid) {
    //mutuals
    const { farcaster_mutuals, farcaster_mutuals_count: fmc } =
      await getMutualFollowers(fid);

    farcaster_mutuals_count = fmc;

    for (const follower of farcaster_mutuals) {
      if (follower.target_profile_with_address) {
        const node = getNodeFromFarcasterProfile(
          follower.target_profile_with_address
        );
        node.mutualFollows = true;
      }
    }

    // followers
    const { farcaster_followers, farcaster_followers_count: ffc } =
      await getFarcasterFollowers(fid);

    farcaster_followers_count = ffc;

    for (const follower of farcaster_followers) {
      if (follower.profile_with_address) {
        const node = getNodeFromFarcasterProfile(follower.profile_with_address);
        node.farcasterFollower = true;
      }
    }

    // following
    const { farcaster_follows, farcaster_follows_count: foc } =
      await getFarcasterFollows(fid);

    farcaster_follows_count = foc;

    for (const follower of farcaster_follows) {
      if (follower.target_profile_with_address) {
        const node = getNodeFromFarcasterProfile(
          follower.target_profile_with_address
        );
        node.farcasterFollows = true;
      }
    }
  }

  return {
    nodes: Object.values(relations)
      .map(node => {
        return { ...node, ...calcScore(node) };
      })
      .sort((a, b) => b.score - a.score),
    tier_counts: {
      5: farcaster_followers_count,
      4: farcaster_follows_count,
      3: farcaster_mutuals_count,
      2: give_transferred_count,
      1: link_holders_count,
    },
  };
};

const calcScore = (node: NetworkNode) => {
  let score = 0;

  if (node.farcasterFollower) {
    score += FARCASTER_FOLLOWER_SCORE;
  }
  if (node.farcasterFollows) {
    score += FARCASTER_FOLLOWS_SCORE;
  }
  if (node.mutualFollows) {
    score += FARCASTER_MUTUAL_FOLLOW_SCORE;
  }
  if (node.sentGiveTo) {
    score += GIVE_SENT_TO_SCORE;
  }
  if (node.receivedGiveFrom) {
    score += GIVE_RECEIVED_FROM_SCORE;
  }
  if (node.linkHolder) {
    score += COLINKED_SCORE;
  }

  const tier =
    score >= COLINKED_SCORE
      ? 1
      : score >= GIVE_RECEIVED_FROM_SCORE
        ? 2
        : score >= FARCASTER_MUTUAL_FOLLOW_SCORE
          ? 3
          : score >= FARCASTER_FOLLOWS_SCORE
            ? 4
            : score >= FARCASTER_FOLLOWER_SCORE
              ? 5
              : 0;
  return {
    tier,
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
