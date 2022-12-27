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
    address,
    circle_id: circle.id,
    role: 0,
  });
});

describe('Delete User action handler', () => {
  test('delete another user as a non-admin', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const deletingAddress = await getUniqueAddress();
    await createProfile(adminClient, { address: deletingAddress });
    await createUser(adminClient, {
      address: deletingAddress,
      circle_id: circle.id,
    });

    await expect(() =>
      client.mutate({
        deleteUser: [
          {
            payload: { address: deletingAddress, circle_id: circle.id },
          },
          { success: true },
        ],
      })
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '401',
              },
              message: 'User not circle admin',
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
      address: adminAddress,
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
          payload: { address, circle_id: circle.id },
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
      address: adminAddress,
      circle_id: circle.id,
      role: 1,
    });
    const client = mockUserClient({
      profileId: adminProfile.id,
      address: adminAddress,
    });

    const nonExistentAddress = await getUniqueAddress();

    await expect(() =>
      client.mutate({
        deleteUser: [
          {
            payload: { address: nonExistentAddress, circle_id: circle.id },
          },
          { success: true },
        ],
      })
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '422',
              },
              message: 'User does not exist',
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
          payload: { address, circle_id: circle.id },
        },
        { success: true },
      ],
    });

    expect(result?.success).toBeTruthy();
  });
});
