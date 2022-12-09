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

let address, profile, circle;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, {
    address,
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
});
