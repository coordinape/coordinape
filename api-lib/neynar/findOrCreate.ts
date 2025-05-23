/* eslint-disable no-console */
import assert from 'assert';

import { uploadURLToCloudflare } from '../../src/features/cloudflare/uploadURLToCloudflare.ts';
import { getGiveBotInviterProfileId } from '../colinks/helperAccounts.ts';
import { autoConnectFarcasterAccount } from '../farcaster/autoConnectFarcasterAccount.ts';
import { adminClient } from '../gql/adminClient.ts';
import {
  fetchUserByAddress,
  fetchUserByFid,
  fetchUserByUsername,
} from '../neynar.ts';

const findProfileByAddresses = async (addresses: string[]) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _in: addresses },
          },
        },
        {
          id: true,
          address: true,
          name: true,
          cosoul: {
            id: true,
          },
          links: true,
          links_held: true,
          farcaster_account: {
            fid: true,
          },
        },
      ],
    },
    {
      operationName: 'neynar_mention__findProfileByAddresses',
    }
  );
  return profiles.pop();
};

export const findOrCreateProfileByUsername = async (username: string) => {
  const fc_profile = await fetchUserByUsername(username);
  // The two diff types of User are not interchangeable because of v1 vs v2, so we need to lookup w/ v2
  return findOrCreateProfileByFid(fc_profile.fid);
};

export const findOrCreateProfileByFid = async (fid: number) => {
  const fc_profile = await fetchUserByFid(fid);
  const prof = findOrCreateUser(fc_profile);
  return prof;
};

export async function findOrCreateProfileByAddress(address: string) {
  // lets try to figure out the user based on address
  const { targetProfiles } = await adminClient.query(
    {
      __alias: {
        targetProfiles: {
          profiles: [
            {
              where: {
                address: { _ilike: address },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
              address: true,
              farcaster_account: {
                fid: true,
                custody_address: true,
              },
            },
          ],
        },
      },
    },
    {
      operationName: 'getNetwork__getTargetProfileByAddress',
    }
  );
  const targetProfile = targetProfiles.pop();

  if (targetProfile) {
    return targetProfile;
  }

  const fcUser = await fetchUserByAddress(address);

  if (fcUser) {
    const profile = await findOrCreateProfileByFid(fcUser.fid);
    return profile;
  }
  return undefined;
}

const findOrCreateUser = async (fc_profile: {
  username: string;
  pfp_url?: string | undefined;
  custody_address: string;
  verified_addresses: { eth_addresses: string[] };
  fid: number;
}) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            farcaster_account: { fid: { _eq: fc_profile.fid } },
          },
        },
        {
          id: true,
          name: true,
          address: true,
          farcaster_account: {
            fid: true,
          },
        },
      ],
    },
    {
      operationName: 'neynar_mention__findOrCreateUser',
    }
  );

  if (profiles.length > 0) {
    const p = profiles.pop();
    if (p && p.farcaster_account) {
      return { ...p, fc_username: fc_profile.username };
    }
  }

  const potential_addresses = [
    fc_profile.custody_address,
    ...fc_profile.verified_addresses.eth_addresses,
  ];

  const profile = await findProfileByAddresses(potential_addresses);

  if (profile) {
    if (!profile.farcaster_account) {
      await autoConnectFarcasterAccount(profile.address, profile.id);
    }
    return { ...profile, fc_username: fc_profile.username };
  } else {
    console.log('No profile found for addresses', potential_addresses);
    const address = potential_addresses.pop();
    console.log('Creating new profile for addr', address);
    assert(address, 'panic: no address to create profile for');

    return await createProfile(
      address,
      fc_profile.username,
      fc_profile.pfp_url
    );
  }
};

const createProfile = async (
  address: string,
  preferred_name: string,
  avatar_url?: string
) => {
  // verify username is not in use
  let name = preferred_name;

  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            name: { _eq: preferred_name },
          },
        },
        {
          __typename: true,
          id: true,
          farcaster_account: {
            fid: true,
          },
        },
      ],
    },
    {
      operationName: 'neynar_mention__checkProfileName',
    }
  );

  if (profiles.length > 0) {
    console.log('Preferred name already in use', preferred_name);
    name = `${preferred_name} ${address.substring(0, 8)}`;
    console.log('Creating new profile with name', name);
  }

  // if we have an avatar_url, upload it to cloudflare for our use
  let avatar = avatar_url;
  if (avatar_url) {
    try {
      avatar = await uploadURLToCloudflare(avatar_url, '/avatar');
    } catch (e) {
      console.error('Error uploading avatar to cloudflare', e);
    }
  }

  const { insert_profiles_one } = await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address,
            connector: FC_BOT_CONNECTOR,
            //points_balance: INITIAL_POINTS, set by db default
            name: name,
            avatar,
            invited_by: await getGiveBotInviterProfileId(),
          },
        },
        {
          id: true,
          address: true,
          name: true,
        },
      ],
    },
    {
      operationName: 'neynar_mention__createProfile',
    }
  );

  assert(insert_profiles_one, "panic: adding profile didn't succeed");
  await autoConnectFarcasterAccount(address, insert_profiles_one.id);
  return { ...insert_profiles_one, fc_username: preferred_name };
};
const FC_BOT_CONNECTOR = 'farcaster-bot-created';
