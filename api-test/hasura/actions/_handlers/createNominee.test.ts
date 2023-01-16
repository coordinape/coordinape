import faker from 'faker';

import { adminClient } from '../../../../api-lib/gql/adminClient';
const { mockLog } = jest.requireMock('../../../../src/common-lib/log');
import {
  createCircle,
  createProfile,
  createUser,
  mockUserClient,
} from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';

let address, profile, circle, user;
const default_req = {
  name: 'Nominated User',
  description: 'Top contributor in DAO',
};

beforeEach(async () => {
  address = await getUniqueAddress();
  circle = await createCircle(adminClient);
  profile = await createProfile(adminClient, {
    address,
    name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
  });
  user = await createUser(adminClient, { address, circle_id: circle.id });
});

describe('Create Nominee action handler', () => {
  test('Create a nomination', async () => {
    const nominationAddress = await getUniqueAddress();
    const client = mockUserClient({ profileId: profile.id, address });
    const { createNominee: result } = await client.mutate({
      createNominee: [
        {
          payload: {
            ...default_req,
            circle_id: circle.id,
            address: nominationAddress,
            name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
          },
        },
        { nominee: { nominated_by_user_id: true } },
      ],
    });
    expect(result?.nominee?.nominated_by_user_id).toEqual(user.id);
  });

  test('Create a nomination with an address that already exists in the circle', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    await expect(() =>
      client.mutate({
        createNominee: [
          {
            payload: { ...default_req, circle_id: circle.id, address },
          },
          { __typename: true },
        ],
      })
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '422',
              },
              message: 'User with address already exists in the circle',
            },
          ],
        },
        null,
        2
      )
    );
  });

  test('Create a nomination with a name that already is taken', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const nominationAddress = await getUniqueAddress();

    await expect(() =>
      client.mutate({
        createNominee: [
          {
            payload: {
              ...default_req,
              circle_id: circle.id,
              address: nominationAddress,
              name: profile.name,
            },
          },
          { __typename: true },
        ],
      })
    ).rejects.toThrow();
    expect(mockLog).toHaveBeenCalledWith(
      JSON.stringify(
        {
          errors: [
            {
              extensions: {
                code: '422',
              },
              message: 'This name is already in use',
            },
          ],
        },
        null,
        2
      )
    );
  });
});
