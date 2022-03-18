import { ethers } from 'ethers';
// TODO: Imports are crazy for esrun, eventually set up a build system.
// Probably with monorepo and support other packages.
import fakerTyped from 'faker/locale/en';
import fakerEn from 'faker/locale/en.js';
const faker = fakerEn as typeof fakerTyped;
import itiriri from 'itiriri';

const iti = (itiriri as unknown as { default: typeof itiriri }).default;
import '../api-lib/node-fetch-shim';
import { LOCAL_SEED_ADDRESS } from '../api-lib/config';
import * as mutations from '../api-lib/gql/mutations';
import * as queries from '../api-lib/gql/queries';

export const USER_ROLE_ADMIN = 1;

async function run() {
  const name = 'Me';
  const address = LOCAL_SEED_ADDRESS.toLowerCase();

  if (!ethers.utils.isAddress(LOCAL_SEED_ADDRESS)) {
    throw new Error('Invalid address, parameter: ' + address);
  }

  const circles = await queries.getCircles();
  const profileResponse = await queries.getProfileAndMembership(address);

  if (profileResponse.profiles.length === 0) {
    await mutations.insertProfiles([
      {
        address,
      },
    ]);
  }

  const circleSet = iti(profileResponse.users).toSet(u => u.circle_id);
  const newMemberships = iti(circles)
    .filter(c => !circleSet.has(c.id))
    .map(c => ({
      address,
      name,
      circle_id: c.id,
      role: USER_ROLE_ADMIN,
    }))
    .toArray();

  return (await mutations.insertMemberships(newMemberships)).insert_users
    ?.returning;
}

(async function () {
  await run()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(res => {
      console.log(res);
      process.exit(0);
    });
})();
