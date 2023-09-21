import { adminClient } from '../../../../api-lib/gql/adminClient';
const { mockLog } = jest.requireMock('../../../../src/common-lib/log');
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let client, adminAddress, adminProfile, circle;

jest.setTimeout(60000);
beforeAll(async () => {
  circle = await createCircle(adminClient);
  adminAddress = await getUniqueAddress();
  adminProfile = await createProfile(adminClient, {
    address: adminAddress,
  });
  await createUser(adminClient, {
    profile_id: adminProfile.id,
    circle_id: circle.id,
    role: 1,
  });

  client = mockUserClient({
    profileId: adminProfile.id,
    address: adminAddress,
  });
});

describe('Delete User action handler', () => {
  test('delete circle users as a non-admin', async () => {
    const address = await getUniqueAddress();
    const deletingAddress1 = await getUniqueAddress();
    const deletingAddress2 = await getUniqueAddress();

    const profile = await createProfile(adminClient, { address });
    const deletingProfile1 = await createProfile(adminClient, {
      address: deletingAddress1,
    });
    const deletingProfile2 = await createProfile(adminClient, {
      address: deletingAddress2,
    });
    await createUser(adminClient, {
      profile_id: profile.id,
      circle_id: circle.id,
      role: 0,
    });
    const nonCircleAdminClient = mockUserClient({
      profileId: profile.id,
      address: address,
    });

    await createUser(adminClient, {
      profile_id: deletingProfile1.id,
      circle_id: circle.id,
      role: 0,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile2.id,
      circle_id: circle.id,
      role: 0,
    });
    await expect(() =>
      nonCircleAdminClient.mutate(
        {
          deleteUsers: [
            {
              payload: {
                addresses: [deletingAddress1, deletingAddress2],
                circle_id: circle.id,
              },
            },
            { success: true },
          ],
        },
        { operationName: 'deleteUsers_test' }
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

  test('delete circle users as an admin', async () => {
    const deletingAddress1 = await getUniqueAddress();
    const deletingAddress2 = await getUniqueAddress();
    const deletingProfile1 = await createProfile(adminClient, {
      address: deletingAddress1,
    });
    const deletingProfile2 = await createProfile(adminClient, {
      address: deletingAddress2,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile1.id,
      circle_id: circle.id,
      role: 0,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile2.id,
      circle_id: circle.id,
      role: 0,
    });
    const { deleteUsers: result } = await client.mutate({
      deleteUsers: [
        {
          payload: {
            addresses: [deletingAddress1, deletingAddress2],
            circle_id: circle.id,
          },
        },
        { success: true },
      ],
    });

    expect(result?.success).toBeTruthy();
  });

  test("delete a user that doesn't exist in the circle", async () => {
    const deletingAddress1 = await getUniqueAddress();
    const deletingProfile1 = await createProfile(adminClient, {
      address: deletingAddress1,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile1.id,
      circle_id: circle.id,
      role: 0,
    });

    const nonExistentAddress = await getUniqueAddress();

    await expect(() =>
      client.mutate({
        deleteUsers: [
          {
            payload: {
              addresses: [nonExistentAddress, deletingAddress1],
              circle_id: circle.id,
            },
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
              message: `Users with these addresses do not exist: ${nonExistentAddress}`,
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

  test('delete a list of users with a duplicate', async () => {
    const deletingAddress1 = await getUniqueAddress();
    const deletingAddress2 = await getUniqueAddress();
    const deletingProfile1 = await createProfile(adminClient, {
      address: deletingAddress1,
    });
    const deletingProfile2 = await createProfile(adminClient, {
      address: deletingAddress2,
    });

    await createUser(adminClient, {
      profile_id: deletingProfile1.id,
      circle_id: circle.id,
      role: 0,
    });
    await createUser(adminClient, {
      profile_id: deletingProfile2.id,
      circle_id: circle.id,
      role: 0,
    });

    await expect(() =>
      client.mutate({
        deleteUsers: [
          {
            payload: {
              addresses: [deletingAddress1, deletingAddress1, deletingAddress2],
              circle_id: circle.id,
            },
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
              message: `Addresses list contains duplicate addresses: ${deletingAddress1}`,
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
});
