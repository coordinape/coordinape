import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { InternalServerError } from '../../../../api-lib/HttpError';
import { BIG_QUESTION_MANAGERS } from '../../../../src/common-lib/constants';

const updateBigQuestionInput = z
  .object({
    big_question_id: z.number().optional().nullable(),
    cover_image_url: z.string(),
    css_background_position: z.string().optional().nullable(),
    description: z.string().optional(),
    expire_at: z.string().optional(),
    prompt: z.string(),
    publish_at: z.string().optional(),
  })
  .strict();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload: {
      big_question_id,
      cover_image_url,
      css_background_position,
      description,
      expire_at,
      prompt,
      publish_at,
    },
    session: { hasuraProfileId: profileId },
  } = await getInput(req, updateBigQuestionInput);
  try {
    if (!BIG_QUESTION_MANAGERS.includes(profileId)) {
      throw new Error('you are not authorized to update big questions');
    }
    if (big_question_id) {
      await adminClient.mutate(
        {
          update_big_questions_by_pk: [
            {
              pk_columns: { id: big_question_id },
              _set: {
                cover_image_url: cover_image_url,
                css_background_position: css_background_position,
                description: description,
                expire_at: expire_at,
                prompt: prompt,
                publish_at: publish_at,
              },
            },
            { id: true },
          ],
        },
        { operationName: 'updateBigQuestion__updateBigQuestion' }
      );
    } else if (prompt && !big_question_id) {
      await adminClient.mutate(
        {
          insert_big_questions_one: [
            {
              object: {
                cover_image_url: cover_image_url,
                css_background_position: css_background_position,
                description: description,
                expire_at: expire_at,
                prompt: prompt,
                publish_at: publish_at,
              },
            },
            { id: true },
          ],
        },
        { operationName: 'updateBigQuestion__insertBigQuestion' }
      );
    }

    return res.status(200).json({ id: true });
  } catch (e) {
    throw new InternalServerError('Unable to fetch big questions', e);
  }
}
