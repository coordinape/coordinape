import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { composeHasuraActionRequestBodyWithApiPermissions } from '../../../../api-lib/requests/schema';
import { zEthAddressOnly } from '../../../../src/lib/zod/formHelpers';

export const deleteUsersInput = z
  .object({
    circle_id: z.number(),
    addresses: z.array(zEthAddressOnly).min(1),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
  } = await composeHasuraActionRequestBodyWithApiPermissions(deleteUsersInput, [
    'manage_users',
  ]).parseAsync(req.body);

  const { circle_id, addresses } = payload;

  const uniqueAddresses = [...new Set(addresses.map(a => a.toLowerCase()))];
  // Check if bulk contains duplicates.
  if (uniqueAddresses.length < addresses.length) {
    const dupes = uniqueAddresses.filter(
      uq => addresses.filter(a => a.toLowerCase() == uq).length > 1
    );
    return errorResponseWithStatusCode(
      res,
      {
        message: `Addresses list contains duplicate addresses: ${dupes}`,
      },
      422
    );
  }

  // Check that all the addresses exist
  const { users: existingUsers } = await adminClient.query(
    {
      users: [
        {
          where: {
            circle_id: { _eq: circle_id },
            // ignore soft_deleted users
            deleted_at: { _is_null: true },
            _or: uniqueAddresses.map(a => {
              return { address: { _ilike: a } };
            }),
          },
        },
        {
          id: true,
          address: true,
        },
      ],
    },
    {
      operationName: 'deleteUserBulk_getExistingUsers',
    }
  );

  // Error out if any of the user addresses does not exist
  if (existingUsers.length < uniqueAddresses.length) {
    const nonExistingUsers = [];
    for (const ua of uniqueAddresses) {
      const userExists = existingUsers.find(
        eu => eu.address.toLowerCase() === ua.toLowerCase()
      );
      if (!userExists) {
        nonExistingUsers.push(ua);
      }
    }
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users with these addresses do not exist: ${nonExistingUsers}`,
      },
      422
    );
  }

  const userIdsDelete = existingUsers.map(eu => eu.id);

  await adminClient.mutate(
    {
      update_users: [
        {
          where: { id: { _in: userIdsDelete } },
          _set: { deleted_at: DateTime.now().toISO() },
        },
        { __typename: true },
      ],
      delete_teammates: [
        {
          where: {
            _or: [
              { user_id: { _in: userIdsDelete } },
              { team_mate_id: { _in: userIdsDelete } },
            ],
          },
        },
        { __typename: true },
      ],
    },
    {
      operationName: 'deleteUserBulk_delete',
    }
  );

  return res.status(200).json({
    success: true,
  });
}

export default authCircleAdminMiddleware(handler);
