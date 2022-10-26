import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { authUserDeleterMiddleware } from '../../../../api-lib/userDeleter';
import {
  deleteMemberInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = composeHasuraActionRequestBody(deleteMemberInput).parse(req.body);

  const { circle_id, address } = payload;

  const {
    members: [existingMember],
  } = await adminClient.query(
    {
      members: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circle_id },
            // ignore soft_deleted members
            deleted_at: { _is_null: true },
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'deleteMember_getExistingMember',
    }
  );

  if (!existingMember) {
    errorResponseWithStatusCode(res, { message: 'member does not exist' }, 422);
    return;
  }

  await adminClient.mutate(
    {
      update_members_by_pk: [
        {
          pk_columns: { id: existingMember.id },
          _set: { deleted_at: DateTime.now().toISO() },
        },
        { __typename: true },
      ],
      delete_teammates: [
        {
          where: {
            _or: [
              { member_id: { _eq: existingMember.id } },
              { team_mate_id: { _eq: existingMember.id } },
            ],
          },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'deleteMember_delete',
    }
  );

  res.status(200).json({
    success: true,
  });
}

export default authUserDeleterMiddleware(handler);
