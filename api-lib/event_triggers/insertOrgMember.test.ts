import { waitFor } from '@testing-library/react';
import sortBy from 'lodash/sortBy';

import { createUser } from '../../api-test/helpers';
import { adminClient } from '../gql/adminClient';
import { Awaited } from '../ts4.5shim';

import handler from './insertOrgMember';

let user1: Awaited<ReturnType<typeof createUser>>;
let user2: Awaited<ReturnType<typeof createUser>>;

beforeAll(async () => {
  user1 = await createUser(adminClient);
  user2 = await createUser(adminClient, { address: user1.address });
});

test('add to org_members when user is created', async () => {
  await waitFor(
    async () => {
      const { org_members } = await adminClient.query(
        {
          org_members: [
            { where: { profile_id: { _eq: user1.profile.id } } },
            { id: true, deleted_at: true, org_id: true },
          ],
        },
        { operationName: 'test' }
      );

      const members = sortBy(org_members, 'profile_id');
      expect(members.length).toBe(2);
      expect(members.map(m => m.org_id).sort()).toEqual(
        [user1, user2].map(u => u.circle.organization.id).sort()
      );
      expect(members.map(m => m.deleted_at)).toEqual([null, null]);
    },
    { timeout: 3000 }
  );
});

test('do nothing when user is deleted', async () => {
  const req = {
    body: { event: { data: { new: { deleted_at: Date.now() } } } },
  };
  const res: any = { status: jest.fn(() => res), json: jest.fn() };

  // @ts-ignore
  await handler(req, res);
  expect(res.json).toBeCalledWith({ message: 'no change' });
});
