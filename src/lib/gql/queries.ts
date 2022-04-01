import { IApiFullCircle, IApiTokenGift, IProtocol } from '../../types';

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

export const getFullCircle = async (
  circle_id: number
): Promise<IApiFullCircle> => {
  const { circles_by_pk, circle } = await client.query({
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
              created_at: true,
              name: true,
              updated_at: true,
            },
            auto_opt_out: true,
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
            name: true,
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
            name: true,
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
            role: true,
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
  });
  if (!circles_by_pk || !circle.circles_by_pk) {
    throw 'problem loading circle';
  }

  // TODO: this crazy type stuff can all go away after fetchManifest is ported
  //  and we can refactor/eliminate the old types
  const fullCircle: Omit<typeof circles_by_pk, 'pending_token_gifts'> & {
    pending_gifts: IApiTokenGift[];
    circle: Omit<typeof circle.circles_by_pk, 'organization'> & {
      protocol: IProtocol;
    };
  } = {
    ...circles_by_pk,
    circle: {
      ...circle.circles_by_pk,
      protocol: circle.circles_by_pk.organization,
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
