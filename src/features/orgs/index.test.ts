import assert from 'assert';

import { faker } from '@faker-js/faker';
import times from 'lodash/times';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { mockUserClient } from '../../../api-test/helpers/mockUserClient';
import { createOrganization } from '../../../api-test/helpers/organizations';

test('basic saving & read permissions', async () => {
  // create three profiles
  const { insert_profiles } = await adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: times(3).map(() => ({
            address: faker.finance.ethereumAddress(),
            name: `${faker.name.firstName()} ${Math.random()
              .toString()
              .substring(2, 7)}`,
          })),
        },
        {
          returning: { id: true, name: true, address: true },
        },
      ],
    },
    { operationName: 'insert_profiles' }
  );

  const profiles = insert_profiles?.returning;
  assert(profiles);

  const org = await createOrganization(adminClient);

  // add only the first two profiles to an org
  await adminClient.mutate(
    {
      insert_org_members: [
        {
          objects: profiles.slice(0, 2).map(p => ({
            profile_id: p.id,
            org_id: org.id,
          })),
        },
        { affected_rows: true },
      ],
    },
    { operationName: 'insert_org_members' }
  );

  const client = mockUserClient({
    profileId: profiles[0].id,
    address: profiles[0].address,
  });

  const { organizations: orgs } = await client.query(
    {
      organizations: [
        {},
        {
          id: true,
          name: true,
          members: [
            {},
            {
              deleted_at: true,
              profile: { id: true, name: true, address: true },
            },
          ],
        },
      ],
    },
    { operationName: 'test' }
  );

  // org is readable
  expect(orgs[0]?.name).toEqual(org.name);

  // org.members is readable
  expect(orgs[0]?.members).toEqual([
    { deleted_at: null, profile: profiles[0] },
    { deleted_at: null, profile: profiles[1] },
  ]);

  const { profiles: p1 } = await client.query(
    {
      profiles: [
        { where: { address: { _ilike: profiles[1].address } } },
        { id: true, name: true, address: true },
      ],
    },
    { operationName: 'test' }
  );

  // profile of org member is readable
  expect(p1[0]).toEqual(profiles[1]);

  const { profiles: p2 } = await client.query(
    {
      profiles: [
        { where: { address: { _ilike: profiles[2].address } } },
        { id: true, name: true },
      ],
    },
    { operationName: 'test' }
  );

  // profile of org non-member is not readable
  expect(p2).toEqual([]);
});
