import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

import { gql } from '../../../api-lib/Gql';
import {
  profiles_constraint,
  ValueTypes,
} from '../../../src/lib/gql/zeusHasuraAdmin';
import { createUserSchemaInput } from '../../../src/lib/zod';

// @ts-ignore
global.fetch = fetch;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // TODO authenticate that the request originated from hasura
  console.error(request.body);
  console.error(request.body.input);

  // Input Validation
  const input: ValueTypes['createUserInput'] = request.body.input;
  const result = await createUserSchemaInput.safeParseAsync(input);
  // a `switch` gets typescript to behave soundly
  // an `if` statement doesn't recognize the result
  // disambiguation for some reason
  console.error('result: ', result);
  switch (result.success) {
    case false:
      return response.status(422).json({
        extensions: result.error.issues,
        message: 'invalid input',
        code: 422,
      });
  }

  // External Constraint Validation
  // I'd prefer to add this uniqueness constraint into the database
  const { object: createUserParams, circle_id } = result.data;

  const { users: existingUsers } = await gql.q('query')({
    users: [
      {
        limit: 1,
        where: {
          name: { _eq: createUserParams.name },
          address: { _eq: createUserParams.address },
          circle_id: { _eq: circle_id },
          // ignore soft_deleted users
          deleted_at: { _is_null: true },
        },
      },
      {
        id: true,
      },
    ],
  });

  if (existingUsers.length === 1) {
    return response.status(422).json({
      extensions: [],
      message: 'User Exists',
      code: '422',
    });
  }

  // Update the state after all validations have passed
  const mutationResult = await gql.q('mutation')({
    // Insert the user
    insert_users_one: [
      { object: { ...createUserParams, circle_id } },
      { id: true },
    ],
    // End any active nomination
    update_nominees: [
      {
        _set: { ended: true },
        where: {
          circle_id: { _eq: circle_id },
          address: { _eq: createUserParams.address },
          name: { _eq: createUserParams.name },
          ended: { _eq: false },
        },
      },
      { returning: { id: true, address: true, name: true } },
    ],
    // Create a profile if none exists yet
    insert_profiles_one: [
      {
        object: { address: createUserParams.address },

        // This clause allows gql to catch the conflict and do nothing
        // hasura calls this an "upsert"
        on_conflict: {
          constraint: profiles_constraint.profiles_address_key,
          // Don't update the entry at all if a profile exists
          // Don't want to touch the timestamp if we aren't actually
          // modifying anything
          update_columns: [],
        },
      },
      {
        address: true,
      },
    ],
  });

  console.error('dope: ', mutationResult);

  // TODO Figure out the correct return payload shape

  return response
    .status(200)
    .json({ address: 'hello', name: 'world', id: '0' });
}
