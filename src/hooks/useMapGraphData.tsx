import iti from 'itiriri';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';

import { assertDef } from 'utils';
import { getAvatarPath } from 'utils/domain';
import {
  createFakeProfile,
  createFakeUser,
  extraEpoch,
  extraGift,
  extraUser,
} from 'utils/modelExtenders';

import { IApiUser, IEpoch, IMapEdge, IMapNode, IProfile, IUser } from 'types';

const isDefinedUser = (user: IApiUser | undefined): user is IApiUser => {
  return !!user;
};

export const QUERY_KEY_MAP_GRAPH_DATA = 'query_mapGraphData';

export function useMapGraphData(circleId: number) {
  return useQuery(
    [QUERY_KEY_MAP_GRAPH_DATA, circleId],
    async () => {
      const { epochs, circles_by_pk: circle } = await client.query(
        {
          epochs: [
            {
              where: {
                circle_id: { _eq: circleId },
                start_date: {
                  _lt: 'now()',
                },
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
          circles_by_pk: [
            {
              id: circleId,
            },
            {
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
          operationName: 'query_mapGraphData',
        }
      );

      if (circle === undefined) {
        return;
      }

      const adaptedUsers = circle.users.map(user => {
        const adaptedUser: Omit<typeof user, 'teammates | user_private'> & {
          teammates?: IApiUser[];
          fixed_payment_amount?: number;
        } = {
          ...user,
          teammates: user.teammates
            .map(tm => {
              const u: IApiUser | undefined = tm.teammate;
              return u;
            })
            .filter(isDefinedUser),
          fixed_payment_amount: user.user_private
            ? user.user_private.fixed_payment_amount
            : 0,
        };
        return adaptedUser;
      });

      const users = adaptedUsers.map(
        ({ profile, ...u }) => ({ profile, ...extraUser(u) } as IUser)
      );

      const userMap = iti(users).toMap(u => u.id);
      const epochsMap = iti(epochs.map(e => extraEpoch(e))).toMap(e => e.id);
      const pending_gifts = circle.pending_token_gifts.map(pg => {
        const notedGift: Omit<typeof pg, 'gift_private'> & {
          note?: string;
        } = {
          ...pg,
          note: pg.gift_private?.note,
        };
        return notedGift;
      });
      const pending = iti(pending_gifts);
      const token_gifts = circle.token_gifts.map(tg => {
        const notedGift: Omit<typeof tg, 'gift_private'> & {
          note?: string;
        } = {
          ...tg,
          note: tg.gift_private?.note,
        };
        return notedGift;
      });
      const pastGifts = iti(token_gifts.map(g => extraGift(g, userMap, false)));
      const allGifts = pending
        .map(g => extraGift({ ...g, id: g.id + 1000000000 }, userMap, true))
        .concat(pastGifts);
      const giftsMap = allGifts.toMap(g => g.id);
      const usersMap = iti(users).toMap(u => u.id);
      const updated = new Map(usersMap);
      const fakeUser = createFakeUser(circleId);
      updated.set(fakeUser.id, fakeUser);

      const userProfileMap = iti(updated.values())
        .groupBy(u => u.address)
        .map(([, us]) => {
          const users = us.toArray();
          // Deleted users don't have profiles
          const activeUser = us.find(u => !u.deleted_at);
          const profile = activeUser?.profile?.address
            ? activeUser?.profile
            : createFakeProfile(assertDef(us.first()));
          return {
            ...profile,
            users,
          } as IProfile;
        })
        .toMap(p => p.address);

      const gifts = iti(giftsMap.values());
      if (epochs.length === 0) {
        return { links: [], nodes: [] };
      }
      const validEpochIds = epochs.map(e => e.id);
      const links = gifts
        .filter(
          g =>
            g.tokens > 0 &&
            g.circle_id === circleId &&
            validEpochIds.includes(g.epoch_id)
        )
        .map((g): IMapEdge => {
          const epoch = epochsMap.get(g.epoch_id) as IEpoch;
          return {
            id: g.id,
            source: g.sender_address,
            target: g.recipient_address,
            epochId: epoch.id,
            epochNumber: epoch.number ?? 1, // ugh
            tokens: g.tokens,
          };
        });

      const linksArray = links.toArray();

      return {
        links: linksArray,
        nodes: iti(linksArray)
          .map(({ source, target, epochId }) => [
            `${epochId}@${source}`,
            `${epochId}@${target}`,
          ])
          .flat(pair => pair)
          .distinct()
          .map(key => {
            const [epochIdStr, address] = key.split('@');
            const profile = assertDef(
              userProfileMap.get(address),
              `Missing profile = ${address} in rMapGraphData`
            );
            const epoch = assertDef(
              epochsMap.get(Number(epochIdStr)),
              `Missing epoch = ${epochIdStr} in rMapGraphData. have ${epochs.map(
                e => e.id
              )}`
            );
            const user = assertDef(
              profile.users.find(u => u.circle_id === epoch.circle_id),
              `Missing user of circle = ${epoch.circle_id} in rMapGraphData at ${profile.address}`
            );

            // FIXME we should stop using ui-avatars.com and rewrite this map code
            // to use fallback text like Avatar does
            const img =
              getAvatarPath(profile?.avatar || user?.profile?.avatar) ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.profile?.name ?? user.name
              )}`;

            return {
              id: address,
              img,
              profile,
              name: user.profile?.name ?? user.name,
              epochId: epoch.id,
              userId: user.id,
            };
          })
          .groupBy(n => n.id)
          .map(([, n]): IMapNode => {
            const epochIds = n.map(m => m.epochId);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { epochId, ...node } = assertDef(
              n.first(),
              'rMapGraphData, node with epochIds'
            );
            return {
              ...node,
              epochIds: epochIds.toArray(),
            };
          })
          .toArray(),
      };
    },
    {
      enabled: !!circleId,
      refetchOnWindowFocus: true,
      notifyOnChangeProps: ['data'],
    }
  );
}
