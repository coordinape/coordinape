import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';

export async function postInfo(req: VercelRequest, res: VercelResponse) {
  try {
    let id: string | undefined;
    if (typeof req.query.id == 'string') {
      id = req.query.id;
    }

    assert(id, 'no id provided');

    const bq = await getPostInfo(id);

    if (!bq) {
      return res.status(404).send({
        message: 'No big question found',
      });
    }

    return res.status(200).send(bq);
  } catch (error: any) {
    return errorResponse(res, error);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return await postInfo(req, res);
}

export const getPostInfo = async (id: string) => {
  const { activities_by_pk } = await adminClient.query(
    {
      activities_by_pk: [
        {
          id: Number(id),
        },
        {
          contribution: {
            description: true,
            profile: {
              id: true,
              avatar: true,
              name: true,
              links: true,
              reputation_score: {
                total_score: true,
              },
            },
          },
        },
      ],
    },
    {
      operationName: 'postInfoForOgTags',
    }
  );
  const post = activities_by_pk;
  assert(post, 'no post found');
  return post.contribution;
};