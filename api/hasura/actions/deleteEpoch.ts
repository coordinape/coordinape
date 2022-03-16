import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  errorResponse,
  zodParserErrorResponse,
} from '../../../api-lib/HttpError';
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
    const { delete_epochs } = await adminClient.mutate({
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
    assert(delete_epochs);
    return response
      .status(200)
      .json({ success: delete_epochs.affected_rows === 1 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return zodParserErrorResponse(response, err.issues);
    }
    return errorResponse(response, err);
  }
}

export default authCircleAdminMiddleware(handler);
