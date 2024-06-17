import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../api-lib/gql/adminClient.ts';
import { errorResponse } from '../../api-lib/HttpError.ts';

// more than this seems to exceed Vercel's 4.5mb response limit
const LIMIT = 25000;

type node = {
  id: string;
  name: string;
  avatar?: string;
};

type link = {
  source: string;
  target: string;
  amount: number;
};

// 1 hour
const maxAge = 60 * 60;
export const CACHE_CONTENT = `public, s-maxage=${maxAge}, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    let address: string | undefined;
    if (typeof req.query.address === 'string' && req.query.address.length > 0) {
      address = req.query.address;
    }
    const data = await fetchLinks(address);

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

async function fetchLinkHolders(address: string | undefined) {
  const { link_holders } = await adminClient.query(
    {
      link_holders: [
        {
          limit: LIMIT,
          ...(address
            ? {
                where: {
                  _or: [
                    {
                      target: {
                        _eq: address,
                      },
                    },
                    {
                      holder: {
                        _eq: address,
                      },
                    },
                  ],
                },
              }
            : {}),
        },
        {
          amount: true,
          holder: true,
          target: true,
          target_profile_public: {
            avatar: true,
            name: true,
          },
          holder_profile_public: {
            avatar: true,
            name: true,
          },
        },
      ],
    },
    {
      operationName: `api_links__fetchLinkHolders @cached(ttl: 300)`,
    }
  );
  assert(link_holders, 'link_holders not found');
  return link_holders;
}

type LinkHolder = Awaited<ReturnType<typeof fetchLinkHolders>>[number];

export async function fetchLinks(address: string | undefined) {
  const link_holders = await fetchLinkHolders(address);
  const data = {
    nodes: buildNodes(link_holders),
    links: buildLinks(link_holders),
  };
  return data;
}

const buildNodes = (link_holders: LinkHolder[]) => {
  const n = new Map<string, node>();
  for (const link of link_holders) {
    n.set(link.holder, {
      id: link.holder,
      name: link.holder_profile_public?.name || 'Unknown',
      avatar: link.holder_profile_public?.avatar,
    });
    n.set(link.target, {
      id: link.target,
      name: link.target_profile_public?.name || 'Unknown',
      avatar: link.target_profile_public?.avatar,
    });
  }
  return [...n.values()];
};

const buildLinks = (link_holders: LinkHolder[]) => {
  const links: link[] = link_holders.map(link => {
    return {
      source: link.holder,
      target: link.target,
      amount: link.amount,
    };
  });
  return links;
};
