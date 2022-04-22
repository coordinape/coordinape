import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { ValueTypes } from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  createUserSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(req: VercelRequest, res: VercelResponse) {
  const {
    input: { payload: input },
  } = composeHasuraActionRequestBody(createUserSchemaInput).parse(req.body);

  // External Constraint Validation
  // It might be preferable to add this uniqueness constraint into the database
  const { circle_id, address, name } = input;

  const { users: existingUsers } = await adminClient.query({
    users: [
      {
        limit: 1,
        where: {
          address: { _ilike: address },
          circle_id: { _eq: circle_id },
        },
      },
      {
        id: true,
        deleted_at: true,
      },
    ],
  });

  const existingUser = existingUsers.pop();

  if (existingUser && !existingUser.deleted_at) {
    return res.status(422).json({
      message: 'User Exists',
      code: '422',
    });
  }

  // create the user

  const createUserMutation: ValueTypes['mutation_root'] =
    existingUser?.deleted_at
      ? {
          update_users_by_pk: [
            {
              pk_columns: { id: existingUser.id },
              _set: {
                ...input,
                deleted_at: null,
                give_token_remaining: input.starting_tokens,
              },
            },
            {
              id: true,
              name: true,
              address: true,
              fixed_non_receiver: true,
              give_token_remaining: true,
              non_giver: true,
              non_receiver: true,
              role: true,
              starting_tokens: true,
            },
          ],
        }
      : {
          insert_users_one: [
            {
              object: { ...input, give_token_remaining: input.starting_tokens },
            },
            {
              id: true,
              name: true,
              address: true,
              fixed_non_receiver: true,
              give_token_remaining: true,
              non_giver: true,
              non_receiver: true,
              role: true,
              starting_tokens: true,
            },
          ],
        };

  // Update the state after all validations have passed
  const mutationResult = await adminClient.mutate({
    // Insert the user
    ...createUserMutation,
    // End any active nomination
    update_nominees: [
      {
        _set: { ended: true },
        where: {
          circle_id: { _eq: circle_id },
          address: { _ilike: address },
          name: { _eq: name },
          ended: { _eq: false },
        },
      },
      {
        returning: {
          id: true,
        },
      },
    ],
  });

  return res
    .status(200)
    .json(mutationResult.insert_users_one ?? mutationResult.update_users_by_pk);
}

export default authCircleAdminMiddleware(handler);
