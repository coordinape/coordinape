import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../../api-lib/HttpError';
import { authUserDeleterBulkMiddleware } from '../../../../api-lib/userDeleterBulk';
import {
  deleteUserBulkInput,
  composeHasuraActionRequestBody,
} from '../../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload },
    session_variables: sessionVariables,
  } = composeHasuraActionRequestBody(deleteUserBulkInput).parse(req.body);

  const { circle_id, addresses } = payload;
  const existingUserIds : number[] = [];
  const uniqueAddresses = [...new Set(addresses.map(a => a.toLowerCase()))];

  // Check whether circle is in active epoch
  const {
    epochs: [currentEpoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          where: {
            circle_id: { _eq: circle_id },
            end_date: { _gt: 'now()' },
            start_date: { _lt: 'now()' },
          },
        },
        { id: true },
      ],
    },
    {
      operationName: 'deleteUserBulk_getCurrentEpoch',
    }
  );
  
  // Admin can delete users even when there is no ongoing epoch
  if(sessionVariables.hasuraRole !== 'admin' && !currentEpoch) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Circle with id ${circle_id} is not in an active epoch.`,
      },
      422
    );
  }

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
  const {
    users: existingUsers,
  } = await adminClient.query(
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
          address: true 
        },
      ],
    },
    {
      operationName: 'deleteUserBulk_getExistingUsers',
    }
  );

  // Error out if any of the user addresses does not exist
  if(existingUsers.length < uniqueAddresses.length) {
    const nonExistingUsers = [];
    for (const ua of uniqueAddresses) {
      const userExists = existingUsers.find(eu => eu.address.toLowerCase() === ua.toLowerCase())
      if (!userExists) {
        nonExistingUsers.push(ua);
      }
    }
    errorResponseWithStatusCode(res, { message: `Users with these addresses do not exist: ${nonExistingUsers}` }, 422);
  }


  // TODO turn into single transaction
  for (const userId of existingUserIds) {
    await adminClient.mutate(
      {
        update_users_by_pk: [
          {
            pk_columns: { id: userId },
            _set: { deleted_at: DateTime.now().toISO() },
          },
          { __typename: true },
        ],
        delete_teammates: [
          {
            where: {
              _or: [
                { user_id: { _eq: userId } },
                { team_mate_id: { _eq: userId } },
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
  }

  res.status(200).json({
    success: true,
  });
}

export default authUserDeleterBulkMiddleware(handler);
