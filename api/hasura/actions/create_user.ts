import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import { authCircleAdminMiddleware } from '../../../api-lib/circleAdmin';
import { gql } from '../../../api-lib/Gql';
import { profiles_constraint } from '../../../src/lib/gql/zeusHasuraAdmin';
import {
  createUserSchemaInput,
  composeHasuraActionRequestBody,
} from '../../../src/lib/zod';

async function handler(request: VercelRequest, response: VercelResponse) {
  try {
    const {
      input: { object: input },
    } = composeHasuraActionRequestBody(createUserSchemaInput).parse(
      request.body
    );

    // External Constraint Validation
    // It might be preferable to add this uniqueness constraint into the database
    const { circle_id, address, name } = input;

    const { users: existingUsers } = await gql.q('query')({
      users: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
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

    if (existingUsers.length > 0) {
      return response.status(422).json({
        message: 'User Exists',
        code: '422',
      });
    }

    // Update the state after all validations have passed
    const mutationResult = await gql.q('mutation')({
      // Insert the user
      insert_users_one: [
        { object: input },
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
      // Create a profile if none exists yet
      insert_profiles_one: [
        {
          object: { address: address },

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

    console.error(mutationResult);
    return response.status(200).json(mutationResult.insert_users_one);
  } catch (err) {
    if (err instanceof z.ZodError) {
      response.status(422).json({
        extensions: err.issues,
        message: 'Invalid input',
        code: '422',
      });
      return;
    }
  }
}

export default authCircleAdminMiddleware(handler);
