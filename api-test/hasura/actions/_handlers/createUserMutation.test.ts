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

const uniqueName = () =>
  `${faker.name.firstName()} ${faker.datatype.number(10000)}`;

const runMutation = (address: string, name: string, circleId: number) =>
  createUserMutation(
    address,
    circleId,
    { name: name, circle_id: circleId },
    ENTRANCE.MANUAL
  );

const checkNames = async (address, name) => {
  const query = await adminClient.query({
    profiles: [{ where: { address: { _ilike: address } } }, { name: true }],
    users: [{ where: { address: { _ilike: address } } }, { name: true }],
  });
  expect(query.profiles[0].name).toMatch(name);
  expect(query.users[0].name).toMatch(name);
};

test('create a new user and a profile', async () => {
  const address = await getUniqueAddress();
  const name = uniqueName();
  await runMutation(address, name, circle.id);
  await checkNames(address, name);
});

test('create a user for a profile without a name', async () => {
  const address = await getUniqueAddress();
  await createProfile(adminClient, { address });

  const name = uniqueName();
  await runMutation(address, name, circle.id);
  await checkNames(address, name);
});

test('prevent using an existing name with a different address', async () => {
  const address = await getUniqueAddress();
  const name = uniqueName();
  await runMutation(address, name, circle.id);

  const address2 = await getUniqueAddress();
  await expect(() => runMutation(address2, name, circle.id)).rejects.toThrow();
});

test('prevent using an existing address with a different name', async () => {
  const address = await getUniqueAddress();
  const name = uniqueName();
  await createProfile(adminClient, { address, name });

  const name2 = uniqueName();
  await expect(() => runMutation(address, name2, circle.id)).rejects.toThrow();
});
