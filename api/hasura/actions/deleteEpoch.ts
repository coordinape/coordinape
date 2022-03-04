import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { gql } from '../../../api-lib/Gql';
import {
  deleteEpochInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const {
      input: { payload: input },
    } = composeHasuraActionRequestBody(deleteEpochInput).parse(request.body);

    const { circle_id, id } = input;
    const { delete_epochs } = await gql.q('mutation')({
      delete_epochs: [
        {
          where: {
            // Check circle_id to ensure epoch is part of this circle
            circle_id: { _eq: circle_id },
            id: { _eq: id },
            start_date: { _gt: new Date() },
            ended: { _eq: false },
          },
        },
        {
          affected_rows: true,
        },
      ],
    });
    assert(delete_epochs, 'Epoch cannot be deleted');
    return response
      .status(204)
      .json({ success: delete_epochs.affected_rows > 0 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return response.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
    }
    return response.status(401).json({
      message: 'Epoch cannot be deleted',
      code: 401,
    });
  }
}

export default authCircleAdminMiddleware(handler);
