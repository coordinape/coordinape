import assert from 'assert';

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
  user2 = await createUser(adminClient, { profile_id: user1.profile_id });
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
    { timeout: 4000 }
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

describe('with deleted user', () => {
  let memberId: number;

  beforeEach(async () => {
    const { org_members } = await adminClient.query(
      {
        org_members: [
          {
            where: {
              profile_id: { _eq: user2.profile.id },
              org_id: { _eq: user2.circle.organization.id },
            },
          },
          { id: true },
        ],
      },
      { operationName: 'test' }
    );

    memberId = org_members[0]?.id;
    assert(memberId);

    await adminClient.mutate(
      {
        update_users_by_pk: [
          { pk_columns: { id: user2.id }, _set: { deleted_at: 'now()' } },
          { deleted_at: true },
        ],
        update_org_members_by_pk: [
          { pk_columns: { id: memberId }, _set: { deleted_at: 'now()' } },
          { deleted_at: true },
        ],
      },
      { operationName: 'test' }
    );
  });

  test('undelete org_members when user is undeleted', async () => {
    await adminClient.mutate(
      {
        update_users_by_pk: [
          { pk_columns: { id: user2.id }, _set: { deleted_at: null } },
          { __typename: true },
        ],
      },
      { operationName: 'test' }
    );

    await waitFor(
      async () => {
        const { org_members_by_pk } = await adminClient.query(
          { org_members_by_pk: [{ id: memberId }, { deleted_at: true }] },
          { operationName: 'test' }
        );
        expect(org_members_by_pk?.deleted_at).toBeNull();
      },
      { timeout: 4000 }
    );
  });
});
