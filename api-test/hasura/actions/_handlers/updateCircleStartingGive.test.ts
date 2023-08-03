import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

const now = DateTime.now();
const DURATION_IN_DAYS = 3;
let address1, address2, profile, client, circle;

beforeEach(async () => {
  address1 = await getUniqueAddress();
  address2 = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address: address1 });
  await createProfile(adminClient, { address: address2 });
  await createUser(adminClient, {
    address: address1,
    circle_id: circle.id,
    role: 1,
  });
  await createUser(adminClient, { address: address2, circle_id: circle.id });
  client = mockUserClient({ profileId: profile.id, address: address1 });
});

test('change circle starting GIVE if no current epoch', async () => {
  const { circles_by_pk: circle1 } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(circle1.starting_tokens).toEqual(100);
  expect(circle1.users[0].starting_tokens).toEqual(100);
  expect(circle1.users[1].starting_tokens).toEqual(100);
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
  const { circles_by_pk: circle2 } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(circle2.starting_tokens).toEqual(150);
  expect(circle2.users[0].starting_tokens).toEqual(150);
  expect(circle2.users[1].starting_tokens).toEqual(150);
});

test('reject starting tokens changes during active epoch', async () => {
  await client.mutate({
    createEpoch: [
      {
        payload: {
          circle_id: circle.id,
          params: {
            type: 'one-off',
            start_date: now.toISO(),
            end_date: now.plus({ days: DURATION_IN_DAYS }).toISO(),
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
  });

  const { circles_by_pk: circle1 } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(circle1.starting_tokens).toEqual(100);
  expect(circle1.users[0].starting_tokens).toEqual(100);
  expect(circle1.users[1].starting_tokens).toEqual(100);
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
  const { circles_by_pk: circle2 } = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { starting_tokens: true, users: [{}, { starting_tokens: true }] },
      ],
    },
    { operationName: 'updateCircleGives' }
  );
  expect(circle2.starting_tokens).toEqual(100);
  expect(circle2.users[0].starting_tokens).toEqual(100);
  expect(circle2.users[1].starting_tokens).toEqual(100);
});
