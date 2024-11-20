import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../api-lib/gql/__generated__/zeus/index';
import { adminClient } from '../../api-lib/gql/adminClient';
import { errorResponse } from '../../api-lib/HttpError';

const LIMIT = 5;

// TODO: refactor to one global cache config?
// 1 hour
const maxAge = 60 * 60;
export const CACHE_CONTENT = `public, s-maxage=${maxAge}, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`;

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  try {
    const data = await fetchTopGiveSkills();

    res.setHeader('Cache-Control', CACHE_CONTENT);
    return res.status(200).json(data);
  } catch (e) {
    return errorResponse(res, e);
  }
}

export async function fetchTopGiveSkills() {
  // fetch all give and cache response
  const { colinks_gives_skill_count } = await adminClient.query(
    {
      colinks_gives_skill_count: [
        {
          limit: LIMIT,
          where: {
            skill: { _is_null: false },
          },
          order_by: [{ gives_last_7_days: order_by.desc }],
        },
        {
          gives_last_7_days: true,
          skill: true,
        },
      ],
    },
    {
      operationName: `api_give_trending_fetchTopGiveSkills @cached(ttl: 300)`,
    }
  );

  assert(colinks_gives_skill_count, 'colinks_gives_skill_count not found');

  return colinks_gives_skill_count;
}
export type giveTrendingData = Awaited<ReturnType<typeof fetchTopGiveSkills>>;
