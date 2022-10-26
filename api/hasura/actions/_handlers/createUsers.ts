import type { VercelRequest, VercelResponse } from '@vercel/node';

import { authCircleAdminMiddleware } from '../../../../api-lib/circleAdmin';
import { ValueTypes } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { insertInteractionEvents } from '../../../../api-lib/gql/mutations';
import {
  errorResponseWithStatusCode,
  InternalServerError,
} from '../../../../api-lib/HttpError';
import {
  composeHasuraActionRequestBody,
  createMembersBulkSchemaInput,
} from '../../../../src/lib/zod';

const USER_ALIAS_PREFIX = 'update_user_';
const NOMINEE_ALIAS_PREFIX = 'update_nominee_';

async function handler(req: VercelRequest, res: VercelResponse) {
  // this has to do parseAsync due to the ENS validation
  const {
    input: { payload: input },
    session_variables: sessionVariables,
  } = await composeHasuraActionRequestBody(
    createMembersBulkSchemaInput
  ).parseAsync(req.body);

  const { circle_id, members } = input;

  const uniqueAddresses = [
    ...new Set(members.map(u => u.address.toLowerCase())),
  ];

  // Check if bulk contains duplicates.
  if (uniqueAddresses.length < members.length) {
    const dupes = uniqueAddresses.filter(
      uq => members.filter(u => u.address.toLowerCase() == uq).length > 1
    );
    return errorResponseWithStatusCode(
      res,
      {
        message: `Members list contains duplicate addresses: ${dupes}`,
      },
      422
    );
  }

  // Load all members of the provided circle with duplicate addresses.
  const { members: existingMembers } = await adminClient.query({
    members: [
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

  const membersToUpdate = existingMembers.map(eu => {
    const updatedMember = members.find(
      u => u.address.toLowerCase() === eu.address.toLowerCase()
    );
    return {
      ...eu,
      ...updatedMember,
      give_token_remaining: updatedMember?.starting_tokens,
    };
  });

  // Check if a user exists without a soft deletion conflicts with the new bulk.
  const conflict = membersToUpdate.filter(u => !u.deleted_at);
  if (conflict.length) {
    return errorResponseWithStatusCode(
      res,
      {
        message: `Member already exist: [${conflict
          .map(e => e.address)
          .join(', ')}]`,
      },
      422
    );
  }

  const newMembers = members
    .filter(u => {
      return !existingMembers.some(
        eu => eu.address.toLowerCase() === u.address.toLowerCase()
      );
    })
    .map(u => ({ ...u, circle_id }));

  const updateMembersMutation = membersToUpdate.reduce((opts, member) => {
    opts[USER_ALIAS_PREFIX + member.address] = {
      update_members_by_pk: [
        {
          pk_columns: { id: member.id },
          _set: {
            ...member,
            deleted_at: null,
          },
        },
        {
          id: true,
        },
      ],
    };

    // End any active nomination
    opts[NOMINEE_ALIAS_PREFIX + member.address] = {
      update_nominees: [
        {
          _set: { ended: true },
          where: {
            circle_id: { _eq: circle_id },
            address: { _ilike: member.address },
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
    insert_members: [
      {
        objects: newMembers,
      },
      {
        returning: {
          id: true,
        },
      },
    ],
    __alias: { ...updateMembersMutation },
  });

  const insertedMembers = mutationResult.insert_members?.returning;

  if (!insertedMembers)
    throw new InternalServerError(
      `panic: insertedMembers is null; ${JSON.stringify(
        mutationResult,
        null,
        2
      )}`
    );

  let profileId: number;
  if (sessionVariables.hasuraRole == 'user') {
    profileId = sessionVariables.hasuraProfileId;
  }

  await insertInteractionEvents(
    ...insertedMembers.map(invitedMemberId => ({
      event_type: 'add_user',
      profile_id: profileId,
      circle_id: input.circle_id,
      data: { invited_user_id: invitedMemberId },
    }))
  );

  // Get the returning values from each update-user aliases.
  const results: Array<{ id: number }> = membersToUpdate
    .map(u => mutationResult[USER_ALIAS_PREFIX + u.address] as { id: number })
    .concat(insertedMembers);

  return res.status(200).json(results);
}

export default authCircleAdminMiddleware(handler);
