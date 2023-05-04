import assert from 'assert';

import { QUERY_KEY_LOGIN_DATA } from 'features/auth/useLoginData';
import { useSavedAuth } from 'features/auth/useSavedAuth';
import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';

import { useRecoilLoadCatch } from 'hooks';
import type { IApiManifest } from 'recoilState';
import { rApiManifest } from 'recoilState';

import type { IApiUser, IProtocol } from 'types';
import { Awaited } from 'types/shim';

const queryManifest = async (profileId: number) => {
  // Fetch as much as we can in this massive query. This mimics the old php fetch-manifest logic.
  // This will be destructured and spread out into smaller queries soon - this is for backwards compat w/ FE with
  // as little disruption as possible.
  const data = await client.query(
    {
      profiles_by_pk: [
        { id: profileId },
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
              address: true,
              bio: true,
              circle_id: true,
              created_at: true,
              epoch_first_visit: true,
              fixed_non_receiver: true,
              give_token_received: true,
              give_token_remaining: true,
              non_giver: true,
              non_receiver: true,
              role: true,
              starting_tokens: true,
              updated_at: true,
              user_private: { fixed_payment_amount: true },
              circle: {
                id: true,
                alloc_text: true,
                allow_distribute_evenly: true,
                auto_opt_out: true,
                cont_help_text: true,
                created_at: true,
                default_opt_in: true,
                fixed_payment_token_type: true,
                fixed_payment_vault_id: true,
                guild_id: true,
                guild_role_id: true,
                is_verified: true,
                logo: true,
                min_vouches: true,
                name: true,
                nomination_days_limit: true,
                only_giver_vouch: true,
                organization_id: true,
                show_pending_gives: true,
                team_selection: true,
                token_name: true,
                updated_at: true,
                vouching_text: true,
                vouching: true,
                organization: {
                  id: true,
                  logo: true,
                  name: true,
                  sample: true,
                  created_at: true,
                  updated_at: true,
                },
              },
            },
          ],
          org_members: [
            { where: { profile_id: { _eq: profileId } } },
            {
              org_id: true,
              role: true,
              organization: {
                id: true,
                name: true,
                guild_id: true,
                guild_role_id: true,
                circles: [
                  {},
                  {
                    id: true,
                    __alias: {
                      myUsers: {
                        users: [
                          { where: { profile: { id: { _eq: profileId } } } },
                          { role: true },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },
    { operationName: 'fetchManifest' }
  );

  assert(data.profiles_by_pk, `unable to load profile ${profileId}`);
  return data;
};

export type QueryManifest = Awaited<ReturnType<typeof queryManifest>>;

// convert data to the form that legacy (pre-Hasura) code expects
const formatLegacyManifest = async (
  manifestQuery: Awaited<ReturnType<typeof queryManifest>>
): Promise<IApiManifest> => {
  const { profiles_by_pk: p } = await manifestQuery;
  assert(p);
  const circles = p.users.map(u => u.circle);

  const adaptedUsers = p.users.map(user => {
    const adaptedUser: Omit<typeof user, 'teammates | user_private'> & {
      fixed_payment_amount?: number;
    } = {
      ...user,
      fixed_payment_amount: user.user_private
        ? user.user_private.fixed_payment_amount
        : 0,
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

  const adaptedCircles = circles.map(circle => {
    const adaptedCircle: Omit<typeof circle, 'organization'> & {
      organization: IProtocol;
    } = {
      ...circle,
      organization: circle.organization,
    };
    return adaptedCircle;
  });

  return {
    circles: adaptedCircles,
    myUsers: adaptedProfile.users || [],
    profile: adaptedProfile,
  };
};

export const useFetchManifest = () => {
  const { savedAuth } = useSavedAuth();
  const queryClient = useQueryClient();

  return useRecoilLoadCatch(
    ({ set }) =>
      async (profileId?: number) => {
        if (!profileId) profileId = savedAuth.id;
        assert(profileId, 'no profile ID for fetchManifest');
        const data = await queryManifest(profileId);

        // legacy data format is still in use in Recoil
        const manifest = await formatLegacyManifest(data);
        set(rApiManifest, manifest);

        queryClient.setQueryData(QUERY_KEY_LOGIN_DATA, data.profiles_by_pk);

        // return the raw query data so new code can use it
        return data;
      },
    [],
    { who: 'fetchManifest' }
  );
};
