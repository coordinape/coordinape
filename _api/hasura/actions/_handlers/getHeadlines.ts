import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { userClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { genHeadline } from '../../../../api-lib/openai';

const LIMIT = 20;

const TIME_AGO = 7 * 24 * 60 * 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { session } = await getInput(req);

  const profileId = session.hasuraProfileId;
  const auth = req.headers.authorization;

  assert(auth, 'Missing auth header');
  try {
    const activities = await getDataForHeadlines({
      auth: auth,
      profileId: profileId,
    });

    const results = await generateHeadlines(activities);
    return res.status(200).json(results);
  } catch (e) {
    console.error(JSON.stringify(e));
    throw new InternalServerError('Unable to fetch similar profiles', e);
  }
}

async function generateHeadlines(activities: Activity[]) {
  const promises = activities.map(async activity => {
    if (!activity.contribution) {
      return null;
    }

    const ai_input = {
      post: activity.contribution,
      replies: activity.replies,
    };

    const { headline, description } = await genHeadline(
      JSON.stringify(ai_input)
    );

    if (headline && description) {
      return {
        activity_id: activity.id,
        headline: headline ?? 'No headline',
        description: description ?? 'Unable to generate description',
      };
    } else {
      return null;
    }
  });

  const results = (await Promise.all(promises)).filter(Boolean);
  return results;
}

const getDataForHeadlines = async ({
  auth,
}: {
  profileId: number;
  auth: string;
}) => {
  const { activities } = await userClient(auth).query(
    {
      activities: [
        {
          where: {
            private_stream: { _eq: true },
            contribution: { id: { _is_null: false } }, // ignore deleted contributions
            created_at: {
              _gte: new Date(Date.now() - TIME_AGO).toISOString(),
            },
          },
          order_by: [
            {
              reply_count: order_by.desc_nulls_last,
              reaction_count: order_by.desc_nulls_last,
            },
          ],
          limit: LIMIT,
        },
        {
          id: true,
          replies: [
            {
              limit: 10,
              order_by: [{ created_at: order_by.desc_nulls_last }],
            },
            { reply: true, profile_public: { name: true } },
          ],
          reactions: [
            {
              limit: 30,
              order_by: [{ created_at: order_by.desc_nulls_last }],
            },
            { reaction: true, profile_public: { name: true } },
          ],
          contribution: { description: true, profile_public: { name: true } },
        },
      ],
    },
    { operationName: 'getHeadlines_getActivities' }
  );
  return activities;
};

type Activity = Awaited<ReturnType<typeof getDataForHeadlines>>[0];
