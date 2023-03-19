import { client } from 'lib/gql/client';

import { IApiProfile, IApiUser } from '../types';

export const queryProfile = async (address: string): Promise<IApiProfile> => {
  const { profiles } = await client.query(
    {
      profiles: [
        {
          where: {
            address: { _ilike: address },
          },
        },
        {
          id: true,
          address: true,
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
          name: true,
          users: [
            {},
            {
              id: true,
              circle_id: true,
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
                allow_distribute_evenly: true,
                cont_help_text: true,
                token_name: true,
                vouching: true,
                min_vouches: true,
                nomination_days_limit: true,
                vouching_text: true,
                only_giver_vouch: true,
                team_selection: true,
                created_at: true,
                updated_at: true,
                organization_id: true,
                organization: {
                  id: true,
                  name: true,
                  sample: true,
                },
                auto_opt_out: true,
                fixed_payment_token_type: true,
                fixed_payment_vault_id: true,
              },
              teammates: [
                {},
                {
                  teammate: {
                    id: true,
                    circle_id: true,
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
                    profile: {
                      id: true,
                      address: true,
                      name: true,
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      operationName: 'getProfile',
    }
  );

  const p = profiles.pop();
  if (!p) {
    throw 'unable to load address: ' + address;
  }

  const adaptedUsers = p.users
    .filter(user => user.circle)
    .map(user => {
      const adaptedUser: Omit<typeof user, 'teammates | organization'> & {
        teammates?: IApiUser[];
        circle: Omit<typeof user.circle, 'organization'> & {
          organization: typeof user.circle.organization;
        };
      } = {
        ...user,
        teammates: user.teammates
          .map(tm => tm.teammate)
          .filter(u => u) as IApiUser[],
        circle: {
          ...user.circle,
          organization: user.circle.organization,
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
