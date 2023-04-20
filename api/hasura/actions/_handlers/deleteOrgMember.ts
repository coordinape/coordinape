import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { isOrgAdmin } from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import {
  UnauthorizedError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    payload,
    session: { hasuraProfileId: profileId },
  } = await getInput(req, z.object({ id: z.number() }), { allowAdmin: true });

  const memberId = payload.id;

  const { org_members_by_pk: member } = await adminClient.query(
    {
      org_members_by_pk: [
        { id: memberId },
        {
          org_id: true,
          deleted_at: true,
          organization: {
            circles: [
              {},
              {
                users: [
                  {
                    where: {
                      deleted_at: { _is_null: true },
                      profile: { org_members: { id: { _eq: memberId } } },
                    },
                  },
                  { id: true },
                ],
              },
            ],
          },
        },
      ],
    },
    { operationName: 'deleteOrgMember_fetch' }
  );

  if (!member || member.deleted_at) {
    throw new UnprocessableError('member does not exist or is already deleted');
  }

  if (member.organization.circles.some(c => c.users.length > 0)) {
    throw new UnprocessableError('member is still in some circle in the org');
  }

  if (!profileId || !(await isOrgAdmin(member.org_id, profileId))) {
    throw new UnauthorizedError('not an org admin');
  }

  await adminClient.mutate(
    {
      update_org_members_by_pk: [
        { pk_columns: { id: memberId }, _set: { deleted_at: 'now' } },
        { __typename: true },
      ],
    },
    { operationName: 'deleteOrgMember_delete' }
  );

  return res.status(200).json({ success: true });
}

export default verifyHasuraRequestMiddleware(handler);
