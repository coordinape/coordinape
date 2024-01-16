import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createEpoch,
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
    role: 1,
  });
});

describe('Delete Epoch action handler', () => {
  test('Test deletion of an epoch that has not yet started', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const epoch = await createEpoch(adminClient, {
      circle_id: circle.id,
      start_date: DateTime.now().plus({ minutes: 1 }),
    });
    const { deleteEpoch: result } = await client.mutate({
      deleteEpoch: [
        {
          payload: { id: epoch.id, circle_id: circle.id },
        },
        { success: true },
      ],
    });

    expect(result).toEqual({ success: true });
  });

  test('Test deletion of an epoch that has already started', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const epoch = await createEpoch(adminClient, {
      circle_id: circle.id,
      start_date: DateTime.now().minus({ minutes: 1 }),
    });
    const { deleteEpoch: result } = await client.mutate({
      deleteEpoch: [
        {
          payload: { id: epoch.id, circle_id: circle.id },
        },
        { success: true },
      ],
    });
    expect(result).toEqual({ success: false });
  });

  test('Test deletion of an epoch that has already ended', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const epoch = await createEpoch(adminClient, {
      circle_id: circle.id,
      start_date: DateTime.now().minus({ days: 4 }),
    });

    const { deleteEpoch: result } = await client.mutate({
      deleteEpoch: [
        {
          payload: { id: epoch.id, circle_id: circle.id },
        },
        { success: true },
      ],
    });
    expect(result).toEqual({ success: false });
  });

  test('Test deletion of an epoch which you are not an admin of', async () => {
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
    const epoch = await createEpoch(adminClient, {
      circle_id: circle.id,
      start_date: DateTime.now().plus({ minutes: 1 }),
    });

    await expect(() =>
      client.mutate(
        {
          deleteEpoch: [
            {
              payload: { id: epoch.id, circle_id: circle.id },
            },
            { success: true },
          ],
        },
        {
          operationName: 'deleteEpoch_test',
        }
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
});
