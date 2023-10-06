import { adminClient } from '../../../../api-lib/gql/adminClient';
const { mockLog } = jest.requireMock('../../../../src/common-lib/log');
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
    role: 0,
  });
});

describe('Delete User action handler', () => {
  test('delete another user as a non-admin', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const deletingAddress = await getUniqueAddress();
    const deletingProfile = await createProfile(adminClient, {
      address: deletingAddress,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile.id,
      circle_id: circle.id,
    });

    await expect(() =>
      client.mutate(
        {
          deleteUser: [
            {
              payload: { profile_id: deletingProfile.id, circle_id: circle.id },
            },
            { success: true },
          ],
        },
        { operationName: 'test' }
      )
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              message: 'User not circle admin',
              extensions: {
                code: '401',
              },
            },
          ],
        },
        null,
        2
      )
    );
  });

  test('delete another user as an admin', async () => {
    const adminAddress = await getUniqueAddress();
    const adminProfile = await createProfile(adminClient, {
      address: adminAddress,
    });
    await createUser(adminClient, {
      profile_id: adminProfile.id,
      circle_id: circle.id,
      role: 1,
    });
    const client = mockUserClient({
      profileId: adminProfile.id,
      address: adminAddress,
    });

    const { deleteUser: result } = await client.mutate({
      deleteUser: [
        {
          payload: { profile_id: adminProfile.id, circle_id: circle.id },
        },
        { success: true },
      ],
    });

    expect(result?.success).toBeTruthy();
  });

  test("delete a user that doesn't exist in the circle", async () => {
    const adminAddress = await getUniqueAddress();
    const adminProfile = await createProfile(adminClient, {
      address: adminAddress,
    });
    await createUser(adminClient, {
      profile_id: adminProfile.id,
      circle_id: circle.id,
      role: 1,
    });
    const client = mockUserClient({
      profileId: adminProfile.id,
      address: adminAddress,
    });

    await expect(() =>
      client.mutate(
        {
          deleteUser: [
            {
              payload: { profile_id: 1234, circle_id: circle.id },
            },
            { success: true },
          ],
        },
        { operationName: 'test' }
      )
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              message: 'User does not exist',
              extensions: {
                code: '422',
              },
            },
          ],
        },
        null,
        2
      )
    );
  });

  test('self-delete as non-admin', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const { deleteUser: result } = await client.mutate({
      deleteUser: [
        {
          payload: { profile_id: profile.id, circle_id: circle.id },
        },
        { success: true },
      ],
    });

    expect(result?.success).toBeTruthy();
  });
});
