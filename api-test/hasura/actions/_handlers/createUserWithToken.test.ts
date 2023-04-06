import { adminClient } from '../../../../api-lib/gql/adminClient';
import { ShareTokenType } from '../../../../src/common-lib/shareTokens';
import {
  createOrganization,
  createProfile,
  mockUserClient,
} from '../../../helpers';

let profile, org, client, token;

beforeAll(async () => {
  profile = await createProfile(adminClient);
  org = await createOrganization(adminClient);

  client = mockUserClient({
    profileId: profile.id,
    address: profile.address,
  });

  const { insert_org_share_tokens_one: data } = await adminClient.mutate(
    {
      insert_org_share_tokens_one: [
        { object: { org_id: org.id, type: ShareTokenType.Invite } },
        { uuid: true },
      ],
    },
    { operationName: 'test' }
  );
  token = data?.uuid;
});

test('add an org member', async () => {
  await client.mutate(
    { createUserWithToken: [{ payload: { token } }, { id: true }] },
    { operationName: 'test' }
  );

  const data = await client.query({
    profiles_by_pk: [
      { id: profile.id },
      { org_members: [{}, { org_id: true }] },
    ],
  });

  expect(data.profiles_by_pk?.org_members[0]?.org_id).toEqual(org.id);
});
