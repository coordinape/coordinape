const assert = jest.requireActual('assert');
const { mockLog } = jest.requireMock('../../../../src/common-lib/log');

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
  jest.spyOn(console, 'info').mockImplementation(() => {});
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  user = await createUser(adminClient, { address, circle_id: circle.id });
});

const default_req = { description: 'wen moon' };

describe('Update Contribution action handler', () => {
  test('Test normal update contribution flow', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const contribution = await createContribution(adminClient, {
      circle_id: circle.id,
      user_id: user.id,
      description: 'i did a thing',
    });
    assert(contribution);
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
      address: newAddress,
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
    });
    assert(contribution);
    const result = client.mutate({
      updateContribution: [
        {
          payload: { id: contribution.id, ...default_req },
        },
        { id: true },
      ],
    });

    await expect(result).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              message: 'contribution does not exist',
              extensions: {
                code: '422',
              },
            },
          ],
        },
        null,
        2
      )
    );
  });
});
