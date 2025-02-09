import assert from 'assert';

import { getProfilesWithAddress } from '../findProfile';
import { adminClient } from '../gql/adminClient';

const EARLY_ACCESS_ADDRESS = '0xdcCd0C2A37cEE91A8E83D64DedA3C0f662560D6D';
const WAITLIST_GUARDIAN_ADDRESS = '0x4E927437aFB1D1A4b529cB28e423850A101dd477';
const ETH_DENVER_INVITER_ADDRESS = '0x3365e273621ca4cd2ebaa9779799d191c7a82cc8';
const GIVE_BOT_INVITER_ADDRESS = '0x2A3219aA4BD1D26991ab1a206402b3f4E9147D9c';
const GIVE_BOT_ADDRESS = '0x68d622988fd4662e521dad7f0466b307f5cc49af';

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
            address: EARLY_ACCESS_ADDRESS.toLowerCase(),
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
      operationName: 'insertEarlyAccessAccount',
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
            address: WAITLIST_GUARDIAN_ADDRESS.toLowerCase(),
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
      operationName: 'insertWaitlistGuardianAccount',
    }
  );
  assert(insert_profiles_one);
  return insert_profiles_one.id;
};

export const getEthDenverInviterProfileId = async () => {
  const profile = await getProfilesWithAddress(ETH_DENVER_INVITER_ADDRESS);
  if (profile) {
    return profile.id;
  }
  // insert this profile if it doesnt exist, or return the id
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: ETH_DENVER_INVITER_ADDRESS.toLowerCase(),
            name: 'Eth Denver 2024',
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'inserEthDenver2024Account',
    }
  );
  assert(insert_profiles_one, 'failed to insert eth denver 2024 profile');
  return insert_profiles_one.id;
};

export const getGiveBotInviterProfileId = async () => {
  const profile = await getProfilesWithAddress(GIVE_BOT_INVITER_ADDRESS);
  if (profile) {
    return profile.id;
  }
  // insert this profile if it doesnt exist, or return the id
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: GIVE_BOT_INVITER_ADDRESS.toLowerCase(),
            name: 'GIVEbot',
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'insertGIVEBotInviterAccount',
    }
  );
  assert(insert_profiles_one, 'failed to insert GIVE bot inviter profile');
  return insert_profiles_one.id;
};
export const getGiveBotProfileId = async () => {
  const profile = await getProfilesWithAddress(GIVE_BOT_ADDRESS);
  if (profile) {
    return profile.id;
  }
  // insert this profile if it doesnt exist, or return the id
  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: GIVE_BOT_ADDRESS.toLowerCase(),
            name: 'GIVEbot custody account',
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'insertGIVEBotAccount',
    }
  );
  assert(insert_profiles_one, 'failed to insert GIVE bot profile');
  return insert_profiles_one.id;
};
