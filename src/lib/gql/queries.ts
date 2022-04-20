import { IApiProfile, IApiUser } from '../../types';

import { client } from './client';

const isDefinedUser = (user: IApiUser | undefined): user is IApiUser => {
  return !!user;
};

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

export const getProfile = async (address: string): Promise<IApiProfile> => {
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
            circle: {
              id: true,
              name: true,
              logo: true,
              default_opt_in: true,
              is_verified: true,
              alloc_text: true,
              team_sel_text: true,
              token_name: true,
              vouching: true,
              min_vouches: true,
              nomination_days_limit: true,
              vouching_text: true,
              only_giver_vouch: true,
              team_selection: true,
              created_at: true,
              updated_at: true,
              protocol_id: true,
              organization: {
                id: true,
                name: true,
              },
              auto_opt_out: true,
            },
            teammates: [
              {},
              {
                teammate: {
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
              },
            ],
          },
        ],
      },
    ],
  });

  const p = profiles.pop();
  if (!p) {
    throw 'unable to load address: ' + address;
  }

  const adaptedUsers = p.users.map(user => {
    const adaptedUser: Omit<typeof user, 'teammates | organization'> & {
      teammates?: IApiUser[];
      circle: Omit<typeof user.circle, 'organization'> & {
        protocol: typeof user.circle.organization;
      };
    } = {
      ...user,
      teammates: user.teammates.map(tm => tm.teammate).filter(isDefinedUser),
      circle: {
        ...user.circle,
        protocol: user.circle.organization,
      },
    };
    return adaptedUser;
  });

  const adaptedProfile: Omit<typeof p, 'skills' | 'users'> & {
    skills?: string[];
    users: IApiUser[];
  } = {
    ...p,
    skills: p.skills && JSON.parse(p.skills),
    users: adaptedUsers,
  };

  return adaptedProfile;
};

export const getDiscordWebhook = async (circleId: number) => {
  const { circle_private } = await client.query({
    circle_private: [
      {
        where: {
          circle_id: {
            _eq: circleId,
          },
        },
      },
      {
        discord_webhook: true,
      },
    ],
  });
  return circle_private.pop()?.discord_webhook;
};
