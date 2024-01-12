import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponse } from '../../../api-lib/HttpError';

export async function bqInfo(req: VercelRequest, res: VercelResponse) {
  try {
    let id: string | undefined;
    if (typeof req.query.id == 'string') {
      id = req.query.id;
    }

    assert(id, 'no id provided');

    const bq = await getBigQuestionInfo(id);

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
  return await bqInfo(req, res);
}

export const getBigQuestionInfo = async (id: string) => {
  const { big_questions_by_pk } = await adminClient.query(
    {
      big_questions_by_pk: [
        {
          id: Number(id),
        },
        {
          cover_image_url: true,
          prompt: true,
          css_background_position: true,
        },
      ],
    },
    {
      operationName: 'profileInfoForOgTags',
    }
  );
  return big_questions_by_pk;
};
