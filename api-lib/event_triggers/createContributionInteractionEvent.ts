import type { VercelRequest, VercelResponse } from '@vercel/node';

import * as mutations from '../gql/mutations';
import { errorResponse } from '../HttpError';
import { EventTriggerPayload } from '../types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const {
      event: {
        data: {
          new: {
            circle_id,
            user_id,
            created_at,
            created_with_api_key_hash,
            id,
            private_stream,
            big_question_id,
          },
        },
      },
    }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

    await mutations.insertInteractionEvents({
      event_type: private_stream
        ? 'post_create'
        : big_question_id
        ? 'big_question_response_create'
        : 'contribution_create',
      circle_id: circle_id,
      profile_id: user_id,
      data: {
        colinks: private_stream || big_question_id ? true : false,
        created_at: created_at,
        created_with_api_key: !!created_with_api_key_hash,
        contribution_id: id,
        hostname: req.headers?.host || '',
        ...(big_question_id && { big_question_id }),
      },
    });

    res.status(200).json({
      message: `contribution interaction event recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}
