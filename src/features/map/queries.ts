import { client } from 'lib/gql/client';

import { useRecoilLoadCatch } from 'hooks';

import { rSelectedCircleIdSource, rApiFullCircle } from './state';

import { IApiFullCircle, IApiTokenGift, IApiUser, IProtocol } from 'types';

const queryFullCircle = async (circle_id: number): Promise<IApiFullCircle> => {
  const { circles_by_pk, circle } = await client.query(
    {
      __alias: {
        circle: {
          circles_by_pk: [
            { id: circle_id },
            {
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
        { id: circle_id },
        {
          nominees: [
            { where: { user: { deleted_at: { _is_null: false } } } },
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
              nominations: [{}, { id: true }],
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
            { where: { deleted_at: { _is_null: true } } },
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
                    profile: { id: true, address: true, name: true },
                  },
                },
              ],
            },
          ],
          token_gifts: [
            { where: { epoch_id: { _is_null: false } } },
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
              gift_private: { note: true },
            },
          ],
          pending_token_gifts: [
            { where: { epoch_id: { _is_null: false } } },
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
              gift_private: { note: true },
            },
          ],
        },
      ],
    },
    { operationName: 'getFullCircle' }
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

export const useFetchCircle = () => {
  return useRecoilLoadCatch(
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
};
