import { adminClient } from '../../../api-lib/gql/adminClient';
import { createCircle, createUser } from '../../../api-test/helpers';
import { setupMockClientForProfile } from 'utils/testing/client';

import { client } from './client';

import { Awaited } from 'types/shim';

let circle: Awaited<ReturnType<typeof createCircle>>;
let user: Awaited<ReturnType<typeof createUser>>;

beforeAll(async () => {
  circle = await createCircle(adminClient);
  user = await createUser(adminClient, {
    circle_id: circle.id,
  });
  setupMockClientForProfile(user.profile);
});

test('soft-deleted rows are excluded', async () => {
  // verify baseline before any deletion
  const q1 = await client.query(
    {
      circles_by_pk: [
        { id: circle.id },
        { id: true, users: [{}, { id: true }] },
      ],
    },
    { operationName: 'test' }
  );

  expect(q1.circles_by_pk?.id).toEqual(circle.id);
  expect(q1.circles_by_pk?.users[0].id).toEqual(user.id);

  // after soft-deleting circle, can't view circle itself,
  // or user for circle

  await adminClient.mutate(
    {
      update_circles_by_pk: [
        {
          pk_columns: { id: circle.id },
          _set: { deleted_at: 'now()' },
        },
        { __typename: true },
      ],
    },
    { operationName: 'test' }
  );

  const q2 = await client.query(
    { circles_by_pk: [{ id: circle.id }, { id: true }] },
    { operationName: 'test' }
  );

  expect(q2.circles_by_pk).toBeNull();

  const q3 = await client.query(
    { users_by_pk: [{ id: user.id }, { id: true }] },
    { operationName: 'test' }
  );

  expect(q3.users_by_pk).toBeNull();
});
