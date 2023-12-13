import assert from 'assert';

import { getProfilesWithAddress } from '../findProfile';
import { adminClient } from '../gql/adminClient';

const EARLY_ACCESS_ADDRESS = '0xdcCd0C2A37cEE91A8E83D64DedA3C0f662560D6D';
const WAITLIST_GUARDIAN_ADDRESS = '0x4E927437aFB1D1A4b529cB28e423850A101dd477';

export const getEarlyAccessProfileId = async () => {
  const profile = await getProfilesWithAddress(EARLY_ACCESS_ADDRESS);
  if (profile) {
    return profile.id;
  }
  // insert this profile if it doesnt exist, or return the id
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: EARLY_ACCESS_ADDRESS,
            name: 'CoLinks Early Access',
            avatar:
              'https://coordinape-staging.s3.amazonaws.com/assets/static/images/3e40dc21-8fbf-4e82-8056-2eaa37fd1e0a.jpg',
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'getEarlyAccessAccount',
    }
  );
  assert(insert_profiles_one);
  return insert_profiles_one.id;
};

export const getWaitListGuardianProfileId = async () => {
  const profile = await getProfilesWithAddress(WAITLIST_GUARDIAN_ADDRESS);
  if (profile) {
    return profile.id;
  }
  // insert this profile if it doesnt exist, or return the id
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: WAITLIST_GUARDIAN_ADDRESS,
            name: 'CoLinks Bouncer',
            avatar:
              'https://coordinape-staging.s3.amazonaws.com/assets/static/images/91894800-0957-472b-b457-c4970ba456a9.jpg',
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'getEarlyAccessAccount',
    }
  );
  assert(insert_profiles_one);
  return insert_profiles_one.id;
};
