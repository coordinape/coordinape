import faker from 'faker';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import {
  createCircle,
  createProfile,
  createUser,
  errorResult,
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
  user = await createUser(adminClient, {
    profile_id: profile.id,
    circle_id: circle.id,
  });
});

describe('Create Nominee action handler', () => {
  test('Create a nomination', async () => {
    const nominationAddress = await getUniqueAddress();
    const client = mockUserClient({ profileId: profile.id, address });
    const { createNominee: result } = await client.mutate(
      {
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
      },
      { operationName: 'createNominee_test' }
    );
    expect(result?.nominee?.nominated_by_user_id).toEqual(user.id);
  });

  test('Create a nomination with an address that already exists in the circle', async () => {
    const client = mockUserClient({ profileId: profile.id, address });

    expect(
      await errorResult(
        client.mutate(
          {
            createNominee: [
              {
                payload: { ...default_req, circle_id: circle.id, address },
              },
              { __typename: true },
            ],
          },
          { operationName: 'createNominee_test' }
        )
      )
    ).toEqual(
      JSON.stringify({
        errors: [
          {
            message: 'User with address already exists in the circle',
            extensions: {
              code: '422',
            },
          },
        ],
      })
    );
  });

  test('Create a nomination with a name that already is taken', async () => {
    const client = mockUserClient({ profileId: profile.id, address });
    const nominationAddress = await getUniqueAddress();

    expect(
      await errorResult(
        client.mutate(
          {
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
          },
          { operationName: 'createNominee_test' }
        )
      )
    ).toEqual(
      JSON.stringify({
        errors: [
          {
            message: 'This name is already in use',
            extensions: {
              code: '422',
            },
          },
        ],
      })
    );
  });
});
