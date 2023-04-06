import { adminClient } from '../../../../api-lib/gql/adminClient';
import { Role } from '../../../../src/lib/users';
import { createUser, createOrgMember, mockUserClient } from '../../../helpers';

let user, member, admin, client;

beforeAll(async () => {
  user = await createUser(adminClient);
  member = await createOrgMember(adminClient, {
    org_id: user.circle.organization.id,
    profile_id: user.profile.id,
  });

  admin = await createUser(adminClient, {
    circle_id: user.circle.id,
    role: Role.ADMIN,
  });

  client = mockUserClient({
    profileId: admin.profile.id,
    address: admin.profile.address,
  });
});

test('allow deleting a member only if they are not in any circle', async () => {
  await expect(
    client.mutate({
      deleteOrgMember: [{ payload: { id: member.id } }, { success: true }],
    })
  ).rejects.toThrow('member is still in some circle in the org');

  await adminClient.mutate(
    {
      update_users_by_pk: [
        { pk_columns: { id: user.id }, _set: { deleted_at: 'now' } },
        { id: true },
      ],
    },
    { operationName: 'test' }
  );

  await expect(
    client.mutate({
      deleteOrgMember: [{ payload: { id: member.id } }, { success: true }],
    })
  ).resolves.toEqual({ deleteOrgMember: { success: true } });
});
