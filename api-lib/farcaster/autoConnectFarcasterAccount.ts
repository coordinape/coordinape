import { adminClient } from '../gql/adminClient.ts';
import { fetchUserByAddress } from '../neynar.ts';

export const autoConnectFarcasterAccount = async (
  address: string,
  profileId: number
) => {
  const fcProfile = await fetchUserByAddress(address);
  if (!fcProfile) {
    throw new Error(
      `No farcaster account found with your CoLinks address (custody or verified)`
    );
  }

  // make sure the fid is not already in use with a different user
  const { existingFids } = await adminClient.query(
    {
      __alias: {
        existingFids: {
          farcaster_accounts: [
            {
              where: {
                fid: { _eq: fcProfile.fid },
                profile_id: { _neq: profileId },
              },
            },
            {
              profile_id: true,
            },
          ],
        },
      },
    },
    {
      operationName: 'fetchUserByFid',
    }
  );

  if (existingFids.length > 0) {
    throw new Error(`farcaster account is connected to a different user`);
  }

  await adminClient.mutate(
    {
      insert_farcaster_accounts_one: [
        {
          object: {
            fid: fcProfile.fid,
            profile_id: profileId,
            username: fcProfile.username,
            name: fcProfile.display_name,
            followers_count: fcProfile.follower_count,
            following_count: fcProfile.following_count,
            pfp_url: fcProfile.pfp_url,
            custody_address: fcProfile.custody_address,
            bio_text: fcProfile.profile.bio.text,
          },
        },
        {
          fid: true,
        },
      ],
    },
    {
      operationName: 'addFarcaster_insert',
    }
  );

  return fcProfile;
};
