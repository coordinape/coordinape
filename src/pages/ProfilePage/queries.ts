import { client } from 'lib/gql/client';

import { extraProfile } from 'utils/modelExtenders';

import { IProfile, IApiUser } from 'types';

export const queryProfile = async (address: string): Promise<IProfile> => {
  const { profiles } = await client.query(
    {
      profiles: [
        { where: { address: { _ilike: address } } },
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
                organization: {
                  id: true,
                  name: true,
                  logo: true,
                  sample: true,
                },
              },
            },
          ],
        },
      ],
    },
    { operationName: 'getProfile' }
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

  return extraProfile(adaptedProfile);
};
