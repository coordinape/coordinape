import faker from 'faker';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { createUserMutation } from '../../../../api/hasura/actions/_handlers/createUserMutation';
import { ENTRANCE } from '../../../../src/common-lib/constants';
import { createCircle, createProfile } from '../../../helpers';
import { getUniqueAddress } from '../../../helpers/getUniqueAddress';
const res: any = { status: jest.fn(() => res), json: jest.fn() };

let circle;
beforeAll(async () => {
  circle = await createCircle(adminClient);
});

const sendMockReq = async (address: string, name: string, circleId: number) => {
  await createUserMutation(
    address,
    circleId,
    {
      name: name,
      circle_id: circleId,
    },
    ENTRANCE.MANUAL
  );
};

test('create a new user and a profile', async () => {
  const address = await getUniqueAddress();
  const name = faker.name.firstName(0);
  await sendMockReq(address, name, circle.id);
  const query = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  expect(query.profiles[0].name).toMatch(name);
  expect(query.users[0].name).toMatch(name);
});

test('create a user with a used name', async () => {
  const address = await getUniqueAddress();
  const name = faker.name.firstName(0);
  await sendMockReq(address, name, circle.id);
  const query = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  expect(query.profiles[0].name).toMatch(name);
  expect(query.users[0].name).toMatch(name);
  const address2 = await getUniqueAddress();
  await sendMockReq(address2, name, circle.id);
  const query2 = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address2 } } }, { name: true }],
    users: [{ where: { address: { _ilike: address2 } } }, { name: true }],
  });
  //the user and the profile won't be created
  expect(query2.profiles[0].name).toBeNull;
  expect(query2.users[0].name).toBeNull;
});

test('create a user for a profile without a name', async () => {
  const address = await getUniqueAddress();
  await createProfile(adminClient, { address: address });

  const query = await adminClient.query({
    profiles: [
      { where: { address: { _ilike: address } } },
      { name: true, address: true },
    ],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  expect(query.profiles[0].name).toBeNull;
  expect(query.profiles[0].address.toLowerCase()).toMatch(
    address.toLowerCase()
  );
  expect(query.users).toBeUndefined;

  const name = faker.name.firstName(0);
  await sendMockReq(address, name, circle.id);
  const query2 = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  //the new name will be used for profile and user
  expect(query2.profiles[0].name).toMatch(name);
  expect(query2.users[0].name).toMatch(name);
});

test('create a user for a profile that has a different name', async () => {
  const address = await getUniqueAddress();
  const name = faker.name.firstName(0);

  await createProfile(adminClient, { address: address, name });

  const query = await adminClient.query({
    profiles: [
      { where: { address: { _ilike: address } } },
      { name: true, address: true },
    ],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  expect(query.profiles[0].name).toMatch(name);
  expect(query.profiles[0].address.toLowerCase()).toMatch(
    address.toLowerCase()
  );
  expect(query.users).toBeUndefined;

  const name2 = faker.name.firstName(0);
  await sendMockReq(address, name2, circle.id);
  const query2 = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  // profile name is unchanged which is used everywhere
  expect(query2.profiles[0].name).toMatch(name);
  expect(query2.users[0].name).toMatch(name2);
});
