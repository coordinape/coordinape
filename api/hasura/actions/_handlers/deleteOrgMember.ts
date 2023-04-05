/**
 * This handler is only needed while org-admin privileges are derived from
 * circle admin roles. Once we're using `org_members.role` instead, the Hasura
 * update permissions can be changed to use that, and then the client can call
 * `update_org_members_by_pk` to soft-delete members.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { isOrgAdmin } from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  UnauthorizedError,
  UnprocessableError,
} from '../../../../api-lib/HttpError';
import { composeHasuraActionRequestBody } from '../../../../src/lib/zod';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
    session_variables: { hasuraProfileId: profileId },
  } = await composeHasuraActionRequestBody(
    z.object({ id: z.number() })
  ).parseAsync(req.body);

  const { org_members_by_pk: member } = await adminClient.query(
    {
      org_members_by_pk: [
        { id: payload.id },
        { org_id: true, deleted_at: true },
      ],
    },
    { operationName: 'deleteOrgMember_fetch' }
  );

  if (!member || member.deleted_at) {
    throw new UnprocessableError('member does not exist or is already deleted');
  }

  if (!profileId || !(await isOrgAdmin(member.org_id, profileId))) {
    throw new UnauthorizedError('not an org admin');
  }

  await adminClient.mutate(
    {
      update_org_members_by_pk: [
        { pk_columns: { id: payload.id }, _set: { deleted_at: 'now' } },
        { __typename: true },
      ],
    },
    { operationName: 'deleteOrgMember_delete' }
  );

  return res.status(200).json({ success: true });
}
