import { DateTime } from 'luxon';

import {
  getMembershipInput,
  makeEpoch,
  createGifts,
  insertMemberships,
} from './util/seed';

const startTime = Date.now();

const addys = [
  '0x5d03501CD7Fef36103bbBee0292631c81b887423',
  '0x65F9CbE9B7fAe893F6D9d2b5ED9B35e40FB0b897',
  '0x00A17AE63A1bedb772ea444751945aa52D3c9714',
  '0xc9fE5F5fd46E474cf52ec09e0D236E1905AbE218',
  '0x1fD13020887A35f8CE64b905D0C0c93Aab3991AD',
  '0x7F4a86478CDD09Aae270bF3800E06e67DB50c76d',
  '0x1c514073d3C20B6a3460aE6A6a6f8d5Cf50C92dE',
  '0x23F24381CF8518c4faFDaEeaC5C0f7c92b7aE678',
  '0x4901030b1B20eBf40b1a219AF6AaD0bc582dB091',
  '0xfa20d0e606e3ed73dae6ce3b3744cbe4b25a4002',
  '0xDaC92C7AcEc40dcE1b3af889355a4B38F1963Bd4',
  '0xbfc7cae0fad9b346270ae8fde24827d2d779ef07',
  '0x8F942ECED007bD3976927B7958B50Df126FEeCb5',
  '0x756bD520e6d52BA027E7a1b3cD59f79ab61DFC34',
  '0xFb6E7472E92e0839c8C3a7d9470797e841Dd8E31',
  '0x8bA320a78491A3530E5CCc5BcA324a515ec1ad5E',
  '0x70b51dd8F953155c80f09a6e73C384095e9A53ff',
  '0x6813730A6D73Ea44a0c5e45EeCE0D5b2ffe4B10c',
  '0x020F64F264ab7e90Ef24a108C379a796a82175dF',
  '0x7dC0eAb0A6C919D072B2f4f02D29fd947C839e5D',
  '0x0e44F1eb0f7782d5d62a3D48B62E89AAd1D7f3dc',
].map(a => a.toLowerCase());

async function main() {
  for (const address of addys) {
    await createOrg(address, 'Org for Claims');
    await createOrg(address, 'Org for Fixed Payment Testing');
  }
}

main()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Finished seeding in ${Date.now() - startTime}ms`))
  .catch(console.error);

async function createOrg(address: string, orgName: string) {
  const result = await insertMemberships(
    getMembershipInput(
      { organizationInput: { name: orgName } },
      { address, name: 'QA Test User' }
    )
  );
  const circleId = result[0].circle_id;
  const epochId1 = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 8 }),
    DateTime.now().minus({ days: 1 }),
    1
  );
  const epochId2 = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 16 }),
    DateTime.now().minus({ days: 9 }),
    2
  );
  const epochId3 = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 17 }),
    DateTime.now().minus({ days: 10 }),
    3
  );
  await createGifts(result, epochId1, 9, 100, false);
  await createGifts(result, epochId2, 8, 100, false);
  await createGifts(result, epochId3, 8, 100, false);
  return circleId;
}
