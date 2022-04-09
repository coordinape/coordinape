import { IApiProfile } from '../../types';

import { client } from './client';

export const getCurrentEpoch = async (
  circle_id: number
): Promise<typeof currentEpoch | undefined> => {
  const {
    epochs: [currentEpoch],
  } = await client.query({
    epochs: [
      {
        where: {
          circle_id: { _eq: circle_id },
          end_date: { _gt: 'now()' },
          start_date: { _lt: 'now()' },
        },
      },
      { id: true },
    ],
  });
  return currentEpoch;
};

export const getOtherUserProfile = async (
  address: string
): Promise<IApiProfile> => {
  const { profiles } = await client.query({
    profiles: [
      {
        where: {
          address: { _ilike: address },
        },
      },
      {
        id: true,
        address: true,
        admin_view: true,
        avatar: true,
        background: true,
        bio: true,
        discord_username: true,
        github_username: true,
        medium_username: true,
        telegram_username: true,
        twitter_username: true,
        website: true,
        skills: true,
        created_at: true,
        updated_at: true,
        users: [
          {},
          {
            id: true,
            circle_id: true,
            name: true,
            address: true,
            non_giver: true,
            fixed_non_receiver: true,
            bio: true,
            starting_tokens: true,
            non_receiver: true,
            give_token_received: true,
            created_at: true,
            updated_at: true,
            give_token_remaining: true,
            role: true,
            epoch_first_visit: true,
          },
        ],
      },
    ],
  });

  const p = profiles.pop();
  if (!p) {
    throw 'unable to load address: ' + address;
  }

  const adaptedProfile: Omit<typeof p, 'skills'> & { skills?: string[] } = {
    ...p,
    skills: p.skills && JSON.parse(p.skills),
  };

  return adaptedProfile;
};
