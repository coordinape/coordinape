import assert from 'assert';

import { rSavedAuth } from 'features/auth/useSavedAuth';
import { client } from 'lib/gql/client';

import {
  IApiFullCircle,
  IApiManifest,
  IApiTokenGift,
  IApiUser,
  IProtocol,
} from '../types';
import { useRecoilLoadCatch } from 'hooks';
import { rSelectedCircleIdSource } from 'recoilState/app';
import { rApiManifest, rApiFullCircle } from 'recoilState/db';

import { Awaited } from 'types/shim';

const queryFullCircle = async (circle_id: number): Promise<IApiFullCircle> => {
  const { circles_by_pk, circle } = await client.query(
    {
      __alias: {
        circle: {
          circles_by_pk: [
            {
              id: circle_id,
            },
            {
              id: true,
              name: true,
              logo: true,
              default_opt_in: true,
              is_verified: true,
              alloc_text: true,
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
                created_at: true,
                name: true,
                updated_at: true,
                sample: true,
              },
              auto_opt_out: true,
              fixed_payment_token_type: true,
              fixed_payment_vault_id: true,
              show_pending_gives: true,
              guild_id: true,
              guild_role_id: true,
            },
          ],
        },
      },
      circles_by_pk: [
        {
          id: circle_id,
        },
        {
          nominees: [
            {
              where: {
                user: {
                  deleted_at: {
                    _is_null: false,
                  },
                },
              },
            },
            {
              id: true,
              address: true,
              nominated_by_user_id: true,
              circle_id: true,
              description: true,
              vouches_required: true,
              user_id: true,
              ended: true,
              nominated_date: true,
              expiry_date: true,
              created_at: true,
              updated_at: true,
              profile: {
                name: true,
              },
              nominations: [
                {},
                {
                  id: true,
                },
              ],
            },
          ],
          epochs: [
            {},
            {
              id: true,
              number: true,
              start_date: true,
              end_date: true,
              circle_id: true,
              created_at: true,
              updated_at: true,
              ended: true,
              grant: true,
              notified_before_end: true,
              notified_start: true,
              notified_end: true,
              days: true,
              repeat: true,
              repeat_day_of_month: true,
              description: true,
            },
          ],
          users: [
            {
              where: {
                deleted_at: { _is_null: true },
              },
            },
            {
              id: true,
              circle_id: true,
              address: true,
              non_giver: true,
              fixed_non_receiver: true,
              starting_tokens: true,
              bio: true,
              non_receiver: true,
              give_token_received: true,
              give_token_remaining: true,
              epoch_first_visit: true,
              created_at: true,
              updated_at: true,
              deleted_at: true,
              profile: {
                avatar: true,
                id: true,
                address: true,
                skills: true,
                name: true,
              },
              user_private: {
                fixed_payment_token_type: true,
                fixed_payment_amount: true,
              },
              role: true,
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
          token_gifts: [
            {
              where: {
                epoch_id: {
                  _is_null: false,
                },
              },
            },
            {
              id: true,
              circle_id: true,
              epoch_id: true,
              sender_id: true,
              sender_address: true,
              recipient_id: true,
              recipient_address: true,
              tokens: true,
              dts_created: true,
              gift_private: {
                note: true,
              },
            },
          ],
          pending_token_gifts: [
            {
              where: {
                epoch_id: {
                  _is_null: false,
                },
              },
            },
            {
              id: true,
              circle_id: true,
              epoch_id: true,
              sender_id: true,
              sender_address: true,
              recipient_id: true,
              recipient_address: true,
              tokens: true,
              dts_created: true,
              gift_private: {
                note: true,
              },
            },
          ],
        },
      ],
    },
    {
      operationName: 'getFullCircle',
    }
  );
  if (!circles_by_pk || !circle) {
    throw new Error(
      `problem loading circle - the circle we tried to load (${circle_id}) could not be found by current user`
    );
  }

  const adaptedUsers = circles_by_pk.users.map(user => {
    const adaptedUser: Omit<typeof user, 'teammates | user_private'> & {
      teammates?: IApiUser[];
      profile: Omit<typeof user.profile, 'skills'> & {
        skills: string[];
      };
      fixed_payment_amount?: number;
    } = {
      ...user,
      teammates: user.teammates
        .map(tm => tm.teammate)
        .filter(u => u) as IApiUser[],
      profile: {
        ...user.profile,
        skills: user.profile.skills ? JSON.parse(user.profile.skills) : [],
      },
      fixed_payment_amount: user.user_private
        ? user.user_private.fixed_payment_amount
        : 0,
    };
    return adaptedUser;
  });

  // TODO: this crazy type stuff can all go away after fetchManifest is ported
  //  and we can refactor/eliminate the old types
  const fullCircle: Omit<
    typeof circles_by_pk,
    'pending_token_gifts' | 'users'
  > & {
    pending_gifts: IApiTokenGift[];
    users: IApiUser[];
    circle: Omit<typeof circle, 'organization'> & {
      organization: IProtocol;
    };
  } = {
    ...circles_by_pk,
    circle: {
      ...circle,
      organization: circle.organization,
    },
    pending_gifts: circles_by_pk.pending_token_gifts.map(pg => {
      const notedGift: Omit<typeof pg, 'gift_private'> & {
        note?: string;
      } = {
        ...pg,
        note: pg.gift_private?.note,
      };
      return notedGift;
    }),
    users: adaptedUsers,
  };
  fullCircle.token_gifts = fullCircle.token_gifts.map(tg => {
    const notedGift: Omit<typeof tg, 'gift_private'> & {
      note?: string;
    } = {
      ...tg,
      note: tg.gift_private?.note,
    };
    return notedGift;
  });
  return fullCircle;
};

const queryManifest = async (address: string) => {
  // Fetch as much as we can in this massive query. This mimics the old php fetch-manifest logic.
  // This will be destructured and spread out into smaller queries soon - this is for backwards compat w/ FE with
  // as little disruption as possible.
  const data = await client.query(
    {
      // org_members: [
      //   { where: { profile_id: { _eq: profileId } }},
      //   { org_id: true, profile_id: true }
      // ],
      circles: [
        { where: { deleted_at: { _is_null: true } } },
        {
          id: true,
          name: true,
          logo: true,
          default_opt_in: true,
          is_verified: true,
          alloc_text: true,
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
            created_at: true,
            updated_at: true,
            logo: true,
            sample: true,
          },
          auto_opt_out: true,
          fixed_payment_token_type: true,
          fixed_payment_vault_id: true,
          show_pending_gives: true,
          guild_id: true,
          guild_role_id: true,
          users: [{}, { address: true }],
        },
      ],
      epochs: [
        {
          where: {
            ended: { _eq: false },
            end_date: { _gt: 'now()' },
          },
        },
        {
          id: true,
          number: true,
          start_date: true,
          end_date: true,
          circle_id: true,
          created_at: true,
          updated_at: true,
          ended: true,
          grant: true,
          notified_before_end: true,
          notified_start: true,
          notified_end: true,
          days: true,
          repeat: true,
          repeat_day_of_month: true,
          description: true,
        },
      ],
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
            {
              where: { circle: { deleted_at: { _is_null: true } } },
            },
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
              user_private: { fixed_payment_amount: true },
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
                    profile: { id: true, address: true, name: true },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    { operationName: 'fetchManifest' }
  );

  assert(
    data.profiles.length,
    `unable to load profile for address: ${address}`
  );
  return data;
};

// convert data to the form that legacy (pre-Hasura) code expects
const formatLegacyManifest = async (
  manifestQuery: Awaited<ReturnType<typeof queryManifest>>
): Promise<IApiManifest> => {
  const { circles, epochs, profiles } = await manifestQuery;
  const p = profiles.pop();
  assert(p);

  let circle: IApiFullCircle | undefined = undefined;
  // Sort by membership to find the first circle that you are a member of
  let loadCircle = false;
  let circleId;
  if (circles.length > 0) {
    circles.sort((a, b) => {
      const memberOfa = a.users.filter(u => u.address == p.address).length > 0;
      const memberOfb = b.users.filter(u => u.address == p.address).length > 0;
      if (memberOfa && !memberOfb) {
        return -1;
      } else if (memberOfb && !memberOfa) {
        return 1;
      } else {
        return a.id - b.id;
      }
    });
    circleId = circles[0].id;
    loadCircle = true;
  }

  // FIXME do we still need to do this?
  if (loadCircle) {
    circle = await queryFullCircle(circleId);
  }

  const adaptedUsers = p.users.map(user => {
    const adaptedUser: Omit<typeof user, 'teammates | user_private'> & {
      teammates?: IApiUser[];
      fixed_payment_amount?: number;
    } = {
      ...user,
      teammates: user.teammates
        .map(tm => tm.teammate)
        .filter(u => u) as IApiUser[],
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
    profile: adaptedProfile,
    active_epochs: epochs,
    circles: adaptedCircles,
    circle: circle,
    myUsers: adaptedProfile.users || [],
  };
};

export const useApiBase = () => {
  const fetchManifest = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async (address?: string) => {
        if (!address) address = (await snapshot.getPromise(rSavedAuth)).address;
        assert(address, 'no address for fetchManifest');
        const data = await queryManifest(address);

        // legacy data format is still in use in Recoil
        const manifest = await formatLegacyManifest(data);
        set(rApiManifest, manifest);

        // return the raw query data so new code can use it
        return data;
      },
    [],
    { who: 'fetchManifest' }
  );

  const fetchCircle = useRecoilLoadCatch(
    ({ set }) =>
      async ({ circleId, select }: { circleId: number; select?: boolean }) => {
        const fullCircle = await queryFullCircle(circleId);

        set(rApiFullCircle, m => {
          const result = new Map(m);
          result.set(fullCircle.circle.id, fullCircle);
          return result;
        });

        if (select) set(rSelectedCircleIdSource, circleId);
      },
    [],
    { who: 'fetchCircle' }
  );

  return { fetchManifest, fetchCircle };
};
