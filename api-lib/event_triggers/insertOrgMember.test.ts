import { waitFor } from '@testing-library/react';

import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
  createOrganization,
} from '../../api-test/helpers';
import { getUniqueAddress } from '../../api-test/helpers/getUniqueAddress';
import { adminClient } from '../gql/adminClient';
let address1: any,
  address2: any,
  profile1: any,
  profile2: any,
  circle1: any,
  circle2: any,
  client: any,
  org: any;

beforeAll(async () => {
  address1 = await getUniqueAddress();
  address2 = await getUniqueAddress();
  org = await createOrganization(adminClient);
  circle1 = await createCircle(adminClient, { organization_id: org.id });
  circle2 = await createCircle(adminClient, { organization_id: org.id });
  profile1 = await createProfile(adminClient, { address: address1 });
  profile2 = await createProfile(adminClient, { address: address2 });
  await createUser(adminClient, {
    address: address1,
    circle_id: circle1.id,
  });
  await createUser(adminClient, {
    address: address2,
    circle_id: circle1.id,
  });
  await createUser(adminClient, {
    address: address1,
    circle_id: circle2.id,
  });
  client = mockUserClient({ profileId: profile2.id, address: address2 });
});

test('Check that the created user has been added to org_members', async () => {
  await waitFor(async () => {
    const { org_members } = await client.query(
      {
        org_members: [{}, { id: true, deleted_at: true, org_id: true }],
      },
      { operationName: 'test' }
    );

    expect(org_members[0].id).toBeDefined();
    expect(org_members[0].org_id).toBe(org.id);
    expect(org_members[0].deleted_at).toBeNull();
  });
});

test('org_member will remain undeleted even if deleted from all org circles', async () => {
  //delete user1 from circle 1
  await adminClient.mutate(
    {
      deleteUser: [
        { payload: { address: address1, circle_id: circle1.id } },
        { success: true },
      ],
    },
    { operationName: 'test' }
  );
  await waitFor(async () => {
    const { org_members: orgMembers1 } = await client.query(
      {
        org_members: [
          { where: { profile_id: { _eq: profile1.id } } },
          { id: true, deleted_at: true },
        ],
      },
      { operationName: 'test' }
    );
    expect(orgMembers1[0].id).toBeDefined();
    expect(orgMembers1[0].deleted_at).toBeNull();
  });

  //delete user1 from circle 2
  await adminClient.mutate(
    {
      deleteUser: [
        { payload: { address: address1, circle_id: circle2.id } },
        { success: true },
      ],
    },
    { operationName: 'test' }
  );

  await waitFor(async () => {
    const { org_members: orgMembers2 } = await client.query(
      {
        org_members: [
          { where: { profile_id: { _eq: profile1.id } } },
          { id: true, deleted_at: true },
        ],
      },
      { operationName: 'test' }
    );
    expect(orgMembers2[0].id).toBeDefined();
    expect(orgMembers2[0].deleted_at).toBeNull();
  });
});
