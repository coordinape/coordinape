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

describe('Delete User action handler', () => {
  test('Test deletion of another user as non Admin flow', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const deletingAddress = await getUniqueAddress();
    await createProfile(adminClient, { address: deletingAddress });
    await createUser(adminClient, { address: deletingAddress, circle_id: circle.id });

    const result = client.mutate({
      deleteUser: [
        {
          payload: { address: deletingAddress, circle_id: circle.id },
        },
        { success: true },
      ],
    });
   
    expect(result).rejects.toThrow;
  });

  test('Test deletion another user as an admin flow', async () => {
    const adminAddress = await getUniqueAddress();
    const adminProfile = await createProfile(adminClient, { address: adminAddress });
    await createUser(adminClient, { address: adminAddress, circle_id: circle.id, role: 1 });
    const client = mockUserClient({ profileId: adminProfile.id, address: adminAddress });

    const {deleteUser: result} = await client.mutate({
      deleteUser: [
        {
          payload: { address, circle_id: circle.id },
        },
        { success: true },
      ],
    });
   
    expect(result?.success).toBeTruthy();
  });

  test('Test self delete as non admin ', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const {deleteUser: result} = await client.mutate({
      deleteUser: [
        {
          payload: { address, circle_id: circle.id },
        },
        { success: true },
      ],
    });
   
    expect(result?.success).toBeTruthy();
  });
});
