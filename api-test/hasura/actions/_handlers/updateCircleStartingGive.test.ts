import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';

const now = DateTime.now();
let circleAdminProfile, circleMemberProfile, circle;

beforeEach(async () => {
  circle = await createCircle(adminClient);
  circleAdminProfile = await createProfile(adminClient);
  circleMemberProfile = await createProfile(adminClient);
  await createUser(adminClient, {
    address: circleAdminProfile.profile,
    circle_id: circle.id,
    role: 1,
  });
  await createUser(adminClient, {
    address: circleMemberProfile.address,
    circle_id: circle.id,
    role: 0,
  });
});

test('change circle starting GIVE if no current epoch', async () => {
  const client = mockUserClient({
    profileId: circleAdminProfile.id,
    address: circleAdminProfile.address,
  });

  const { circles_by_pk: initialCircle } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(initialCircle?.starting_tokens).toEqual(100);
  expect(initialCircle?.users[0].starting_tokens).toEqual(100);
  expect(initialCircle?.users[1].starting_tokens).toEqual(100);
  await client.mutate(
    {
      updateCircleStartingGive: [
        { payload: { circle_id: circle.id, starting_tokens: 150 } },
        { success: true },
      ],
    },
    {
      operationName: 'updateCircleGives',
    }
  );
  const { circles_by_pk: updatedCircle } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(updatedCircle?.starting_tokens).toEqual(150);
  expect(updatedCircle?.users[0].starting_tokens).toEqual(150);
  expect(updatedCircle?.users[1].starting_tokens).toEqual(150);
});

test('reject starting tokens changes during active epoch', async () => {
  const client = mockUserClient({
    profileId: circleAdminProfile.id,
    address: circleAdminProfile.address,
  });

  await client.mutate(
    {
      createEpoch: [
        {
          payload: {
            circle_id: circle.id,
            params: {
              type: 'one-off',
              start_date: now.toISO(),
              end_date: now.plus({ days: 3 }).toISO(),
            },
          },
        },
        {
          id: true,
          epoch: {
            start_date: true,
            end_date: true,
            repeat_data: [{}, true],
          },
        },
      ],
    },
    { operationName: 'createEpoch' }
  );

  const { circles_by_pk: initialCircle } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(initialCircle?.starting_tokens).toEqual(100);
  expect(initialCircle?.users[0].starting_tokens).toEqual(100);
  expect(initialCircle?.users[1].starting_tokens).toEqual(100);
  await expect(
    client.mutate(
      {
        updateCircleStartingGive: [
          { payload: { circle_id: circle.id, starting_tokens: 150 } },
          { success: true },
        ],
      },
      {
        operationName: 'updateCircleGives',
      }
    )
  ).rejects.toThrowError(
    'Cannot update starting tokens during an active epoch'
  );
  const { circles_by_pk: updatedCircle } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(updatedCircle?.starting_tokens).toEqual(100);
  expect(updatedCircle?.users[0].starting_tokens).toEqual(100);
  expect(updatedCircle?.users[1].starting_tokens).toEqual(100);
});

test('reject non Admin changes', async () => {
  const nonAdminClient = mockUserClient({
    profileId: circleMemberProfile.id,
    address: circleMemberProfile.address,
  });

  await expect(
    nonAdminClient.mutate(
      {
        updateCircleStartingGive: [
          { payload: { circle_id: circle.id, starting_tokens: 150 } },
          { success: true },
        ],
      },
      {
        operationName: 'updateCircleGives',
      }
    )
  ).rejects.toThrow('User not circle admin');
});
