import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { userClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { genHeadline } from '../../../../api-lib/openai';

const LIMIT = 15;

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
    const activity_id = activity.id;
    const { headline, description } = await genHeadline(
      JSON.stringify(activity)
    );
    return { activity_id, headline, description };
  });

  const results = (await Promise.all(promises)).filter(Boolean);
  return results;
}

const getDataForHeadlines = async ({
  profileId,
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
            actor_profile_id: { _neq: profileId }, // ignore own activities
          },
          order_by: [{ reply_count: order_by.desc_nulls_last }],
          limit: LIMIT,
        },
        {
          id: true,
          replies: [{}, { reply: true, profile: { name: true } }],
          reactions: [{}, { reaction: true, profile: { name: true } }],
          contribution: { description: true },
        },
      ],
    },
    { operationName: 'getHeadlines_getActivities' }
  );
  return activities;
};

type Activity = Awaited<ReturnType<typeof getDataForHeadlines>>[0];
