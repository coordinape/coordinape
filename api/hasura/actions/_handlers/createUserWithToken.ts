import assert from 'assert';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { AuthenticationError } from 'apollo-server-express';
import { z } from 'zod';

import { ShareTokenType } from '../../.../../../../src/common-lib/shareTokens';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getAddress } from '../../../../api-lib/gql/queries';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { UnprocessableError } from '../../../../api-lib/HttpError';
import { verifyHasuraRequestMiddleware } from '../../../../api-lib/validate';
import { ENTRANCE } from '../../../../src/common-lib/constants';
import { isGuildMember } from '../../../../src/features/guild/guild-api';

import { createUserMutation } from './createUserMutation';

const createUserFromTokenInput = z
  .object({
    token: z.string().uuid(),
  })
  .strict();

async function handler(req: VercelRequest, res: VercelResponse) {
  const { payload, session } = await getInput(req, createUserFromTokenInput);

  const address = await getAddress(session.hasuraProfileId);
  const { profiles } = await adminClient.query(
    {
      profiles: [
        { where: { address: { _ilike: address } } },
        { id: true, name: true },
      ],
    },
    { operationName: 'getProfileNameForCreateUser' }
  );

  const profile = profiles.pop();
  if (!profile?.name) {
    throw new UnprocessableError(
      'must have your profile name set before you join'
    );
  }
  assert(profile);

  if (await handleOrg(profile.id, payload.token, res)) return;

  // get the circleId from the token - it's ok if this is a welcome token or a invite token
  // we'll check invite vs welcome below to make sure its ok for them to join
  const { circle_share_tokens } = await adminClient.query(
    {
      circle_share_tokens: [
        {
          where: {
            uuid: { _eq: payload.token },
            circle: { deleted_at: { _is_null: true } },
          },
        },
        {
          circle_id: true,
          type: true,
          circle: { guild_id: true, guild_role_id: true },
        },
      ],
    },
    { operationName: 'createUserWithToken_getCircleShareTokens' }
  );

  const token = circle_share_tokens.pop();
  const circleId = token?.circle_id;
  if (!circleId) {
    throw new UnprocessableError('invalid circle link');
  }

  let entrance = ENTRANCE.LINK;
  // if its an invite link, they can join, if not they better have another way to join!
  if (token.type != ShareTokenType.Invite) {
    // check guild
    if (!token.circle.guild_id) {
      throw new AuthenticationError('not allowed to join');
    }
    const guildOk = await isGuildMember(
      token.circle.guild_id,
      address,
      token.circle.guild_role_id
    );
    if (!guildOk) {
      throw new AuthenticationError('not allowed to join');
    }
    entrance = ENTRANCE.GUILD;
  }
  // ok - they can join
  // create the user
  const mutationResult = await createUserMutation(
    address,
    circleId,
    { circle_id: circleId },
    profile.name,
    entrance
  );

  return res
    .status(200)
    .json(mutationResult.insert_users_one ?? mutationResult.update_users_by_pk);
}

// if token matches org_share_tokens, create/undelete an org_member
const handleOrg = async (
  profileId: number,
  token: string,
  res: VercelResponse
): Promise<boolean> => {
  const { org_share_tokens } = await adminClient.query(
    {
      org_share_tokens: [
        { where: { uuid: { _eq: token } } },
        {
          organization: {
            id: true,
            members: [
              { where: { profile_id: { _eq: profileId } } },
              { id: true, deleted_at: true },
            ],
          },
        },
      ],
    },
    { operationName: 'createUserWithToken_getOrgShareTokens' }
  );

  const org = org_share_tokens[0]?.organization;
  if (!org) return false;

  const existingMember = org.members[0];

  if (existingMember && !existingMember.deleted_at) {
    // nothing to do
    res.status(200).json({ id: existingMember.id });
    return true;
  }

  // undelete existing member
  if (existingMember?.deleted_at) {
    const { update_org_members_by_pk: update } = await adminClient.mutate(
      {
        update_org_members_by_pk: [
          { pk_columns: { id: existingMember.id }, _set: { deleted_at: null } },
          { id: true },
        ],
      },
      { operationName: 'createUserWithToken_undeleteOrgMember' }
    );
    if (!update?.id) throw new UnprocessableError("couldn't undelete member");

    res.status(200).json({ id: update.id });
    return true;
  }

  // create new member
  const { insert_org_members_one: newMember } = await adminClient.mutate(
    {
      insert_org_members_one: [
        {
          object: {
            org_id: org.id,
            profile_id: profileId,
            entrance: ENTRANCE.LINK,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'createUserWithToken_insertOrgMember' }
  );
  if (!newMember?.id) throw new UnprocessableError("couldn't create member");
  res.status(200).json({ id: newMember?.id });
  return true;
};

export default verifyHasuraRequestMiddleware(handler);
