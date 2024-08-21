import type { VercelRequest, VercelResponse } from '@vercel/node';

import { order_by } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { BIG_QUESTION_MANAGERS } from '../../../../src/common-lib/constants';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    session: { hasuraProfileId: profileId },
  } = await getInput(req);

  try {
    if (!BIG_QUESTION_MANAGERS.includes(profileId)) {
      throw new Error('You are not authroized to access this page');
    }
    const { big_questions } = await adminClient.query(
      {
        big_questions: [
          {
            where: { expire_at: { _gt: 'now()' } },
            order_by: [{ publish_at: order_by.asc }],
          },
          {
            id: true,
            prompt: true,
            description: true,
            expire_at: true,
            publish_at: true,
            css_background_position: true,
            cover_image_url: true,
            activities_aggregate: [{}, { aggregate: { count: [{}, true] } }],
          },
        ],
      },
      { operationName: 'getBigQuestions__getBigQuestions' }
    );
    return res.status(200).json(big_questions);
  } catch (e) {
    throw new InternalServerError('Unable to fetch big questions', e);
  }
}
