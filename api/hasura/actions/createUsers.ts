import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { ValueTypes } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { errorResponseWithStatusCode } from '../../../api-lib/HttpError';
import {
  composeHasuraActionRequestBody,
  createUsersBulkSchemaInput,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(createUsersBulkSchemaInput).parse(
    req.body
  );

  const { circle_id, users } = input;

  const uniqueAddresses = [...new Set(users.map(u => u.address.toLowerCase()))];

  // Check if bulk contains duplicates.
  if (uniqueAddresses.length < users.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users list contains duplicate address.`,
      },
      422
    );
  }

  // Load all members of the provided circle with duplicate addresses.
  const { users: existingUsers } = await adminClient.query({
    users: [
      {
        where: {
          circle_id: { _eq: circle_id },
          _or: uniqueAddresses.map(add => {
            return { address: { _ilike: add } };
          }),
        },
      },
      {
        id: true,
        address: true,
        deleted_at: true,
        starting_tokens: true,
      },
    ],
  });

  const usersToUpdate = existingUsers.map(eu => {
    const updatedUser = users.find(
      u => u.address.toLowerCase() === eu.address.toLowerCase()
    );
    return {
      ...eu,
      ...updatedUser,
      give_token_remaining: updatedUser?.starting_tokens,
    };
  });

  // Check if a user exists without a soft deletion conflicts with the new bulk.
  const conflict = usersToUpdate.filter(u => !u.deleted_at);
  if (conflict.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Users already exist: [${conflict
          .map(e => e.address)
          .join(', ')}]`,
      },
      422
    );
  }

  const newUsers = users
    .filter(u => {
      return !existingUsers.some(
        eu => eu.address.toLowerCase() === u.address.toLowerCase()
      );
    })
    .map(u => ({ ...u, circle_id }));

  const updateUsersMutation = usersToUpdate.reduce((opts, user) => {
    opts[user.address] = {
      update_users_by_pk: [
        {
          pk_columns: { id: user.id },
          _set: {
            ...user,
            deleted_at: null,
          },
        },
        {
          id: true,
        },
      ],
    };

    // End any active nomination
    opts[user.address + '_update_nominee'] = {
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: user.address },
            name: { _eq: user.name },
            ended: { _eq: false },
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    };
    return opts;
  }, {} as { [aliasKey: string]: ValueTypes['mutation_root'] });

  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate({
    insert_users: [
      {
        objects: newUsers,
      },
      {
        returning: {
          id: true,
        },
      },
    ],
    __alias: { ...updateUsersMutation },
  });

  // Get the returning values from each update-user aliases.
  const results = usersToUpdate
    .map(u => mutationResult[u.address].update_users_by_pk)
    .concat(mutationResult.insert_users?.returning as []);

  return res.status(200).json(results);
}

export default authCircleAdminMiddleware(handler);
