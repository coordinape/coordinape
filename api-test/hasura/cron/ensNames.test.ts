import { VercelRequest } from '@vercel/node';
import faker from 'faker';

import { adminClient } from '../../../api-lib/gql/adminClient';
import handler from '../../../api/hasura/cron/ensNames';
import { createProfile } from '../../helpers';
import { getUniqueAddress } from '../../helpers/getUniqueAddress';

let name0, name1;
jest.setTimeout(10000);
beforeAll(async () => {
  const address0 = await getUniqueAddress();
  const address1 = await getUniqueAddress();
  const address2 = await getUniqueAddress();

  name0 = faker.name.firstName();
  name1 = faker.name.firstName();

  const result = await adminClient.query(
    {
      profiles: [
        {
          where: { name: { _eq: 'vitalik.eth' } },
        },
        {
          id: true,
          address: true,
          name: true,
        },
      ],
    },
    {
      operationName: 'cronTest_getEnsProfiles',
    }
  );

  //for repeating the test
  if (!result.profiles[0]) {
    await createProfile(adminClient, {
      address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      name: 'vitalik.eth',
    });
  }

  await createProfile(adminClient, {
    address: address0,
    name: name0.concat('.eth'),
  });

  await createProfile(adminClient, {
    address: address1,
    name: name0.concat('.eth*'),
  });

  await createProfile(adminClient, {
    address: address2,
    name: name1.concat('.eth'),
  });
});

test('check ensNames cron', async () => {
  const req = {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  } as unknown as VercelRequest;
  const res: any = { status: jest.fn(() => res), json: jest.fn() };
  await handler(req, res);
  const result = await adminClient.query(
    {
      profiles: [
        {},
        {
          id: true,
          address: true,
          name: true,
        },
      ],
    },
    {
      operationName: 'cronTest_getEnsProfiles',
    }
  );

  expect(
    result.profiles.find(profile => profile.name === 'vitalik.eth') !==
      undefined
  ).toBeTruthy();
  expect(
    result.profiles.find(profile => profile.name === name0.concat('.eth')) ===
      undefined
  ).toBeTruthy();
  expect(
    result.profiles.find(profile => profile.name === name0.concat('.eth**')) !==
      undefined
  ).toBeTruthy();
  expect(
    result.profiles.find(profile => profile.name === name1.concat('.eth')) ===
      undefined
  ).toBeTruthy();
  expect(
    result.profiles.find(profile => profile.name === name1.concat('.eth*')) !==
      undefined
  ).toBeTruthy();
});
