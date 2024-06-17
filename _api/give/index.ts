import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse } from '../../api-lib/HttpError.ts';

const LIMIT = 25000;

type node = {
  id: string;
  name: string;
  avatar: string;
};

type link = {
  source: string;
  target: string;
  skill: string;
};

// 1 hour
const maxAge = 60 * 60;
const CACHE_CONTENT = `public, s-maxage=${maxAge}, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await fetchCoLinksGives();

    res.setHeader('Cache-Control', CACHE_CONTENT);
    res.setHeader('IsBanana', 'true');
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

export async function fetchCoLinksGives(skill?: string) {
  // fetch all give and cache response
  const { colinks_gives } = await adminClient.query(
    {
      colinks_gives: [
        {
          limit: LIMIT,
          ...(skill
            ? {
                where: {
                  skill: {
                    _eq: skill,
                  },
                },
              }
            : {}),
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
  const links: link[] = gives.map((give: any) => {
    return {
      source: give.giver_profile_public.address,
      target: give.target_profile_public.address,
      skill: give.skill,
    };
  });
  return links;
};
