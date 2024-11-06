import type { VercelRequest, VercelResponse } from '@vercel/node';

import { EnrichedCastSelector } from '../../../api-lib/farcaster/fetchCastsById.ts';
import { hydrateCasts } from '../../../api-lib/farcaster/hydration.ts';
import { order_by, Selector } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient.ts';

const LIMIT = 10;
const TIME_PERIOD = '2 days';

export const activitySelector = Selector('activities')({
  id: true,
  action: true,
  created_at: true,
  private_stream: true,
  cast_id: true,
  gives: [
    {
      order_by: [
        {
          created_at: order_by.desc,
        },
      ],
    },
    {
      id: true,
      skill: true,
      attestation_uid: true,
      giver_profile_public: {
        name: true,
        id: true,
        address: true,
        avatar: true,
      },
    },
  ],
  gives_aggregate: [{}, { aggregate: { count: [{}, true] } }],
  actor_profile_public: {
    id: true,
    name: true,
    avatar: true,
    address: true,
    cosoul: {
      id: true,
    },
  },
  circle: {
    id: true,
    name: true,
    logo: true,
  },
  target_profile: {
    name: true,
    avatar: true,
    address: true,
    cosoul: {
      id: true,
    },
  },
  big_question: {
    cover_image_url: true,
    description: true,
    prompt: true,
    id: true,
    expire_at: true,
    publish_at: true,
  },
  contribution: {
    description: true,
    created_at: true,
    id: true,
  },
  epoch: {
    start_date: true,
    description: true,
    end_date: true,
    number: true,
    ended: true,
  },
  reply_count: true,
  reactions: [
    {},
    {
      id: true,
      reaction: true,
      profile_public: {
        name: true,
        id: true,
      },
    },
  ],
  enriched_cast: {
    hash: true,
  },
});

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  const { most_reacted_casts } = await adminClient.query(
    {
      most_reacted_casts: [
        {
          args: {
            // TODO: these double limits are troublesome
            result_limit: LIMIT * 2,
            time_period: TIME_PERIOD,
            reaction_type: 1,
          },
          where: {
            enriched_cast: {},
          },
          limit: LIMIT,
        },
        {
          target_hash: true,
          count: true,
          enriched_cast: {
            ...EnrichedCastSelector,
            activity: activitySelector,
          },
        },
      ],
    },
    {
      operationName: 'recentLikes @cached(ttl: 300)',
    }
  );

  const castArray = most_reacted_casts.map((c: any) => c.enriched_cast);
  const activitiesArray = most_reacted_casts.map(
    (c: any) => c.enriched_cast.activity
  );
  const enrichedCasts = await hydrateCasts(castArray);

  const activitiesWithCasts = activitiesArray.map(
    (activity: any, index: number) => {
      return { ...activity, cast: enrichedCasts[index] };
    }
  );

  res.status(200).json({ activities: activitiesWithCasts });
}
