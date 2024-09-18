import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../api-lib/gql/__generated__/zeus/index.ts';
import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse } from '../../api-lib/HttpError.ts';

// more than this seems to exceed Vercel's 4.5mb response limit
const LIMIT = 25000;

type node = {
  id: string;
  name: string;
  avatar: string;
};

// 1 hour
const maxAge = 60 * 60;
export const CACHE_CONTENT = `public, s-maxage=${maxAge}, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let skill: string | undefined;
    if (typeof req.query.skill === 'string' && req.query.skill.length > 0) {
      skill = req.query.skill;
    }

    let profileId: number | undefined;
    if (typeof req.query.profileId === 'string') {
      profileId = parseInt(req.query.profileId);
    }

    let address: string | undefined;
    if (typeof req.query.address === 'string') {
      address = req.query.address;
    }

    const data = await fetchCoLinksGives(skill, profileId, address);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

export async function fetchCoLinksGives(
  skill?: string,
  profileId?: number,
  address?: string
) {
  // fetch all give and cache response
  const { colinks_gives } = await adminClient.query(
    {
      colinks_gives: [
        {
          limit: LIMIT,
          order_by: [{ id: order_by.desc }],
          where: {
            _and: [
              {
                ...(skill
                  ? {
                      skill: {
                        _eq: skill,
                      },
                    }
                  : {}),
              },
              {
                ...(profileId
                  ? {
                      _or: [
                        {
                          target_profile_id: {
                            _eq: profileId,
                          },
                        },
                        {
                          profile_id: {
                            _eq: profileId,
                          },
                        },
                      ],
                    }
                  : {}),
              },
              {
                ...(address
                  ? {
                      _or: [
                        {
                          target_profile_public: {
                            address: {
                              _ilike: address,
                            },
                          },
                        },
                        {
                          giver_profile_public: {
                            address: {
                              _ilike: address,
                            },
                          },
                        },
                      ],
                    }
                  : {}),
              },
            ],
          },
        },
        {
          id: true,
          skill: true,
          target_profile_public: {
            avatar: true,
            address: true,
            name: true,
          },
          giver_profile_public: {
            avatar: true,
            address: true,
            name: true,
          },
        },
      ],
    },
    {
      operationName: `api_give__fetchGraphData @cached(ttl: 300)`,
    }
  );

  assert(colinks_gives, 'colinks_gives not found');

  const data = {
    nodes: buildNodes(colinks_gives),
    links: buildLinks(colinks_gives),
  };
  return data;
}

const buildNodes = (gives: any) => {
  const n = new Map<string, node>();
  for (const give of gives) {
    n.set(give.giver_profile_public.address, {
      id: give.giver_profile_public.address,
      name: give.giver_profile_public.name,
      avatar: give.giver_profile_public.avatar,
    });
    n.set(give.target_profile_public.address, {
      id: give.target_profile_public.address,
      name: give.target_profile_public.name,
      avatar: give.target_profile_public.avatar,
    });
  }
  return [...n.values()];
};

const buildLinks = (gives: any) => {
  // use json string for unique set, as Set does not work with objects
  const linkSet = new Set<string>();
  for (const give of gives) {
    linkSet.add(
      JSON.stringify({
        source: give.giver_profile_public.address,
        target: give.target_profile_public.address,
        skill: give.skill,
      })
    );
  }

  return [...linkSet.values()].map(l => JSON.parse(l));
};
