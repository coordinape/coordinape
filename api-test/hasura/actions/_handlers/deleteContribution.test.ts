import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createContribution,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, user, contribution;

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  user = await createUser(adminClient, { address, circle_id: circle.id });
  contribution = await createContribution(mockUserClient(
    { profileId: profile.id, address }), 
    { circle_id: circle.id,
      user_id: user.id,
      description: 'i did a thing',
  });
});

describe('Delete Contribution action handler', () => {
  test('delete a contribution', async () => {    
    const client = mockUserClient({ profileId: profile.id, address });
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
  
  test('Test deletion of a contribution that you did not create', async () => {
    const newAddress = await getUniqueAddress();
    const newProfile = await createProfile(adminClient, { address: newAddress });
    await createUser(adminClient, { address: newAddress, circle_id: circle.id });
    const client = mockUserClient({ profileId: newProfile.id, address: newAddress });
    const result = client.mutate({
      deleteContribution: [
        {
          payload: { contribution_id: contribution.id },
        },
        { success: true },
      ],
    });
    await expect(
      async () => await result
    ).rejects.toThrow;
  });
  
});
