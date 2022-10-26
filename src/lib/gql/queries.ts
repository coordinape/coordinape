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
          members: [
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
                organization_id: true,
                organization: {
                  id: true,
                  name: true,
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

  const adaptedMembers = p.members.map(member => {
    const adaptedMember: Omit<typeof member, 'teammates | organization'> & {
      teammates?: IApiUser[];
      circle: Omit<typeof member.circle, 'organization'> & {
        organization: typeof member.circle.organization;
      };
    } = {
      ...member,
      teammates: member.teammates.map(tm => tm.teammate).filter(isDefinedUser),
      circle: {
        ...member.circle,
        organization: member.circle.organization,
      },
    };
    return adaptedMember;
  });

  const adaptedProfile: Omit<typeof p, 'skills' | 'members'> & {
    skills?: string[];
    members: IApiUser[];
  } = {
    ...p,
    skills: p.skills && JSON.parse(p.skills),
    members: adaptedMembers,
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
              organization_id: true,
              organization: {
                id: true,
                created_at: true,
                name: true,
                updated_at: true,
              },
              auto_opt_out: true,
              fixed_payment_token_type: true,
              fixed_payment_vault_id: true,
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
                member: {
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
              nominated_by_member_id: true,
              circle_id: true,
              description: true,
              vouches_required: true,
              member_id: true,
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
          members: [
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
              },
              member_private: {
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

  const adaptedMembers = circles_by_pk.members.map(member => {
    const adaptedMember: Omit<typeof member, 'teammates | member_private'> & {
      teammates?: IApiUser[];
      profile: Omit<typeof member.profile, 'skills'> & {
        skills: string[];
      };
      fixed_payment_amount?: number;
    } = {
      ...member,
      teammates: member.teammates.map(tm => tm.teammate).filter(isDefinedUser),
      profile: {
        ...member.profile,
        skills: member.profile.skills ? JSON.parse(member.profile.skills) : [],
      },
      fixed_payment_amount: member.member_private
        ? member.member_private.fixed_payment_amount
        : 0,
    };
    return adaptedMember;
  });

  // TODO: this crazy type stuff can all go away after fetchManifest is ported
  //  and we can refactor/eliminate the old types
  const fullCircle: Omit<
    typeof circles_by_pk,
    'pending_token_gifts' | 'members'
  > & {
    pending_gifts: IApiTokenGift[];
    members: IApiUser[];
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
    members: adaptedMembers,
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
          organization_id: true,
          organization: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
            logo: true,
          },
          auto_opt_out: true,
          fixed_payment_token_type: true,
          fixed_payment_vault_id: true,
          members: [{}, { address: true }],
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
          members: [
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
              member_private: {
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
      const memberOfa =
        a.members.filter(u => u.address == p.address).length > 0;
      const memberOfb =
        b.members.filter(u => u.address == p.address).length > 0;
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

  const adaptedMembers = p.members.map(member => {
    const adaptedMember: Omit<typeof member, 'teammates | member_private'> & {
      teammates?: IApiUser[];
      fixed_payment_amount?: number;
    } = {
      ...member,
      teammates: member.teammates.map(tm => tm.teammate).filter(isDefinedUser),
      fixed_payment_amount: member.member_private
        ? member.member_private.fixed_payment_amount
        : 0,
    };
    return adaptedMember;
  });

  const adaptedProfile: Omit<typeof p, 'skills' | 'members'> & {
    skills?: string[];
    members: IApiUser[];
  } = {
    ...p,
    skills: p.skills && JSON.parse(p.skills),
    members: adaptedMembers,
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
    myUsers: adaptedProfile.members || [],
  };
  return manifest;
};
