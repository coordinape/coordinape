import { vi } from 'vitest';


import { adminClient } from '../../../../api-lib/gql/adminClient';
import { DebugLogger } from '../../../../src/common-lib/log';
import {
  createCircle,
  createContribution,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let mockLog = vi.mock('../../../../src/common-lib/log',{


let address, profile, circle, user;

beforeEach(async () => {
  vi.spyOn(console, 'info').mockImplementation(() => {});
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, { address });
  user = await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
  });
  vi.clearAllMocks();
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
