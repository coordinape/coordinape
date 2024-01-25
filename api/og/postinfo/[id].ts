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
  const { contributions_by_pk } = await adminClient.query(
    {
      contributions_by_pk: [
        {
          id: Number(id),
        },
        {
          description: true,
          profile: {
            avatar: true,
            name: true,
          },
        },
      ],
    },
    {
      operationName: 'postInfoForOgTags',
    }
  );
  return contributions_by_pk;
};
