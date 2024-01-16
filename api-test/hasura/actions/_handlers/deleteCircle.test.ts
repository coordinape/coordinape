import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

const { mockLog } = await vi.importMock('../../../../src/common-lib/log');

let address, profile, circle;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
  });
});

describe('Delete Circle action handler', () => {
  test('Test deletion of circle', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const { deleteCircle: result } = await client.mutate({
      deleteCircle: [
        {
          payload: { circle_id: circle.id },
        },
        { success: true },
      ],
    });
    expect(result).toEqual({ success: true });

    const { circles_by_pk: queryResult } = await adminClient.query({
      circles_by_pk: [
        {
          id: circle.id,
        },
        {
          deleted_at: true,
        },
      ],
    });
    expect(queryResult?.deleted_at).toBeTruthy();
  });
  test('Test deletion of circle as a non admin', async () => {
    const newAddress = await getUniqueAddress();
    const newProfile = await createProfile(adminClient, {
      address: newAddress,
    });
    await createUser(adminClient, {
      profile_id: newProfile.id,
      circle_id: circle.id,
      role: 0,
    });
    const client = mockUserClient({
      profileId: newProfile.id,
      address: newAddress,
    });
    await expect(() =>
      client.mutate({
        deleteCircle: [
          {
            payload: { circle_id: circle.id },
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
});
