import { adminClient, mockUserClient } from '../../api-lib/gql';
import {
  createCircle,
  createContribution,
  createProfile,
  createUser,
  deleteContribution,
  findContributionById,
} from '../helpers';
import { getUniqueAddress } from '../helpers/getUniqueAddress';

describe('deleteContribution()', () => {
  it('should soft delete a contribution', async () => {
    const address = await getUniqueAddress();

    const circle = await createCircle(adminClient);

    const profile = await createProfile(adminClient, { address });

    const user = await createUser(adminClient, {
      address,
      circle_id: circle.id,
    });

    const userClient = mockUserClient({ profileId: profile.id, address });

    const contribution = await createContribution(userClient, {
      circle_id: circle.id,
      user_id: user.id,
    });

    expect(contribution?.deleted_at).toBeFalsy();

    const result = await deleteContribution(userClient, {
      contribution_id: contribution?.id,
    });

    expect(result).toEqual({ success: true });

    const deletedContribution = await findContributionById(
      adminClient,
      contribution?.id
    );

    expect(deletedContribution?.deleted_at).not.toBeFalsy();
  });
});
