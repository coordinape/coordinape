import {
  IApiFullCircle,
  IApiManifest,
  IApiProfile,
  IApiTokenGift,
  IApiUser,
  IProtocol,
} from '../../types';

import { client } from './client';

const isDefinedUser = (user: IApiUser | undefined): user is IApiUser => {
  return !!user;
};

export const getCurrentEpoch = async (
  circle_id: number
): Promise<typeof currentEpoch | undefined> => {
  const {
    epochs: [currentEpoch],
  } = await client.query(
    {
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
    },
    {
      operationName: 'getCurrentEpoch',
    }
  );
  return currentEpoch;
};

export const getProfile = async (address: string): Promise<IApiProfile> => {
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
      operationName: 'getProfile',
    }
  );

  const p = profiles.pop();
  if (!p) {
    throw 'unable to load address: ' + address;
  }

  const adaptedUsers = p.users.map(user => {
    const adaptedUser: Omit<typeof user, 'teammates | organization'> & {
      teammates?: IApiUser[];
      circle: Omit<typeof user.circle, 'organization'> & {
        organization: typeof user.circle.organization;
      };
    } = {
      ...user,
      teammates: user.teammates
        .map(tm => {
          const u: IApiUser | undefined = tm.teammate;
          return u;
        })
        .filter(isDefinedUser),
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

export const getDiscordWebhook = async (circleId: number) => {
  const { circle_private } = await client.query(
    {
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
    },
    {
      operationName: 'getDiscordWebhook',
    }
  );
  return circle_private.pop()?.discord_webhook;
};

export const getFullCircle = async (
  circle_id: number
): Promise<IApiFullCircle> => {
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
        .map(tm => {
          const u: IApiUser | undefined = tm.teammate;
          return u;
        })
        .filter(isDefinedUser),
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

export const fetchManifest = async (address: string): Promise<IApiManifest> => {
  // Fetch as much as we can in this massive query. This mimics the old php fetch-manifest logic.
  // This will be destructured and spread out into smaller queries soon - this is for backwards compat w/ FE with
  // as little disruption as possible.
  const manifestQuery = client.query(
    {
      circles: [
        {
          where: { deleted_at: { _is_null: true } },
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
          users: [{}, { address: true }],
        },
      ],
      epochs: [
        {
          where: {
            ended: { _eq: false },
            end_date: {
              _gt: 'now()',
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
            {
              where: { circle: { deleted_at: { _is_null: true } } },
            },
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
              user_private: {
                fixed_payment_amount: true,
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
      operationName: 'fetchManifest',
    }
  );

  // we have to fetch manifest first because it clues us in to which circle we need to fetch
  const { circles, epochs, profiles } = await manifestQuery;

  const p = profiles.pop();
  if (!p) {
    throw 'unable to load profile for address: ' + address;
  }

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
    circle = await getFullCircle(circleId);
  }

  const adaptedUsers = p.users.map(user => {
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

  const manifest = {
    profile: adaptedProfile,
    active_epochs: epochs,
    circles: adaptedCircles,
    circle: circle,
    myUsers: adaptedProfile.users || [],
  };
  return manifest;
};
