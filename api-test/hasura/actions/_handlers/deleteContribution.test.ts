import assert from 'assert';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, user;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  user = await createUser(adminClient, { address, circle_id: circle.id });
});

test('create and delete a contribution', async () => {
  const client = mockUserClient({ profileId: profile.id, address });
  const { insert_contributions_one: contribution } = await client.mutate({
    insert_contributions_one: [
      {
        object: {
          circle_id: circle.id,
          user_id: user.id,
          description: 'i did a thing',
        },
      },
      { id: true, description: true },
    ],
  });

  assert(contribution?.id);
  expect(contribution.description).toEqual('i did a thing');

  const { deleteContribution: result } = await client.mutate({
    deleteContribution: [
      {
        payload: { contribution_id: contribution.id },
      },
      { success: true },
    ],
  });

  expect(result).toEqual({ success: true });

  const { contributions_by_pk: deleted } = await adminClient.query({
    contributions_by_pk: [{ id: contribution.id }, { deleted_at: true }],
  });

  expect(deleted?.deleted_at).not.toBeFalsy();
});
