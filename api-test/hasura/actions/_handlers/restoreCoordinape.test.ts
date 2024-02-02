import { DateTime } from 'luxon';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  errorResult,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, coordUser;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
    role: 1,
  });
  const coordinapeProfile = await createProfile(adminClient, {
    address: COORDINAPE_USER_ADDRESS,
    name: 'Coordinape',
  });
  coordUser = await createUser(adminClient, {
    profile_id: coordinapeProfile.id,
    role: 2,
    circle_id: circle.id,
    deleted_at: DateTime.now().toISO(),
  });
});

test('restore Coordinape User as an admin', async () => {
  const client = mockUserClient({ profileId: profile.id, address });
  const { restoreCoordinape: result } = await client.mutate(
    {
      restoreCoordinape: [
        { payload: { circle_id: circle.id } },
        { success: true },
      ],
    },
    { operationName: 'test' }
  );
  expect(result).toEqual({ success: true });
  const { users_by_pk: coordResult } = await adminClient.query(
    {
      users_by_pk: [{ id: coordUser.id }, { deleted_at: true }],
    },
    { operationName: 'test' }
  );
  expect(coordResult?.deleted_at).toEqual(null);
});

test('restore Coordinape User as a non admin', async () => {
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

  expect(
    await errorResult(
      client.mutate(
        {
          restoreCoordinape: [
            { payload: { circle_id: circle.id } },
            { success: true },
          ],
        },
        { operationName: 'test' }
      )
    )
  ).toEqual(
    JSON.stringify({
      errors: [
        {
          message: 'User not circle admin',
          extensions: {
            code: '401',
          },
        },
      ],
    })
  );
});

test('restore Coordinape User when it is not deleted yet', async () => {
  const client = mockUserClient({ profileId: profile.id, address });
  await adminClient.mutate(
    {
      update_users_by_pk: [
        {
          pk_columns: { id: coordUser.id },
          _set: { deleted_at: null },
        },
        { __typename: true },
      ],
    },
    { operationName: 'test' }
  );
  await expect(() =>
    client.mutate(
      {
        restoreCoordinape: [
          { payload: { circle_id: circle.id } },
          { success: true },
        ],
      },
      { operationName: 'test' }
    )
  ).rejects.toThrow();
});
