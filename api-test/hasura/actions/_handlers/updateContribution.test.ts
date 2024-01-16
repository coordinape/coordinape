import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createContribution,
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
  user = await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
  });
});

const default_req = { description: 'wen moon' };

describe('Update Contribution action handler', () => {
  test('Test normal update contribution flow', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const contribution = await createContribution(adminClient, {
      circle_id: circle.id,
      user_id: user.id,
      description: 'i did a thing',
      profile_id: profile.id,
    });
    expect(contribution).not.toBeNull();
    const { updateContribution: result } = await client.mutate(
      {
        updateContribution: [
          {
            payload: { id: contribution.id, ...default_req },
          },
          { id: true },
        ],
      },
      { operationName: 'updateContribution_test' }
    );
    expect(result?.id).toBe(contribution.id);
  });

  test('cannot modify a contribution from a different user', async () => {
    const newAddress = await getUniqueAddress();
    const newProfile = await createProfile(adminClient, {
      address: newAddress,
    });
    await createUser(adminClient, {
      profile_id: newProfile.id,
      circle_id: circle.id,
    });
    const client = mockUserClient({
      profileId: newProfile.id,
      address: newAddress,
    });
    const contribution = await createContribution(adminClient, {
      circle_id: circle.id,
      user_id: user.id,
      description: 'i did a thing',
      profile_id: profile.id,
    });
    expect(contribution).not.toBeNull();
    const result = client.mutate({
      updateContribution: [
        {
          payload: { id: contribution.id, ...default_req },
        },
        { id: true },
      ],
    });

    await expect(() => result).rejects.toThrowError(
      'contribution does not exist'
    );
    try {
      await result;
    } catch (e) {
      const err = e as any;
      const res = JSON.stringify(err.response);

      expect(res).toEqual(
        JSON.stringify({
          errors: [
            {
              message: 'contribution does not exist',
              extensions: {
                code: '422',
              },
            },
          ],
        })
      );
    }

    const expectedError = new Error('contribution does not exist');
    await expect(result).rejects.toThrow(expectedError);
  });
});
