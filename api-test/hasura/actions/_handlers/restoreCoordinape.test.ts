import { DateTime } from 'luxon';

import { COORDINAPE_USER_ADDRESS } from '../../../../api-lib/config';
import { adminClient } from '../../../../api-lib/gql/adminClient';
const { mockLog } = jest.requireMock('../../../../src/common-lib/log');
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, coordUser;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  await createUser(adminClient, {
    address,
    circle_id: circle.id,
    role: 1,
  });
  await createProfile(adminClient, {
    address: COORDINAPE_USER_ADDRESS,
    name: 'Coordinape',
  });
  coordUser = await createUser(adminClient, {
    address: COORDINAPE_USER_ADDRESS,
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
    address: newAddress,
    circle_id: circle.id,
    role: 0,
  });
  const client = mockUserClient({
    profileId: newProfile.id,
    address: newAddress,
  });

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
