import assert from 'assert';

import { client } from 'lib/gql/client';

import { extraProfile } from 'utils/modelExtenders';

import { IApiUser } from 'types';
import { Awaited } from 'types/shim';

export const queryProfile = async (address: string) => {
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
          cosoul: {
            id: true,
          },
          users: [
            {},
            {
              id: true,
              circle_id: true,
              profile_id: true,
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

  const adaptedProfile: Omit<typeof p, 'skills' | 'users' | 'cosoul'> & {
    skills?: string[];
    users: IApiUser[];
    hasCoSoul: boolean;
  } = {
    ...p,
    skills: p.skills && JSON.parse(p.skills),
    users: adaptedUsers,
    hasCoSoul: !!p.cosoul,
  };

  return extraProfile(adaptedProfile);
};

export const queryProfilePgive = async (address?: string) => {
  assert(address, 'no address provided');
  const { totalPgive, mintInfo } = await client.query(
    {
      __alias: {
        totalPgive: {
          member_epoch_pgives_aggregate: [
            {
              where: {
                user: { profile: { address: { _ilike: address } } },
              },
            },
            { aggregate: { sum: [{}, { normalized_pgive: true }] } },
          ],
        },
        mintInfo: {
          cosouls: [
            {
              where: {
                profile: { address: { _ilike: address } },
              },
            },
            {
              created_at: true,
              token_id: true,
              profile: {
                reputation_score: {
                  total_score: true,
                },
              },
            },
          ],
        },
      },
    },
    { operationName: 'getProfile_totalPgive' }
  );
  const totalPgiver: number | undefined = (totalPgive.aggregate?.sum as any)
    .normalized_pgive;
  return {
    totalPgive: totalPgiver ?? 0,
    mintInfo: mintInfo.length > 0 ? mintInfo[0] : undefined,
    repScore:
      mintInfo.length > 0
        ? mintInfo[0].profile?.reputation_score?.total_score ?? 0
        : 0,
  };
};

export type QueryProfilePgive = Awaited<ReturnType<typeof queryProfilePgive>>;
export const QUERY_KEY_PROFILE_TOTAL_PGIVE = 'queryProfilePgive';
