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
            description,
            id,
          },
        },
      },
    }: EventTriggerPayload<'contributions', 'INSERT'> = req.body;

    await mutations.insertInteractionEvents({
      event_type: 'contribution_create',
      circle_id: circle_id,
      profile_id: user_id,
      data: {
        created_at: created_at,
        description_length: description.length,
        created_with_api_key_hash: !!created_with_api_key_hash,
        contribution_id: id,
      },
    });

    res.status(200).json({
      message: `contribution interaction event recorded`,
    });
  } catch (e) {
    return errorResponse(res, e);
  }
}
