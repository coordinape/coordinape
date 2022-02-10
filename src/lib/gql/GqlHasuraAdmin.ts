import {
  Thunder,
  apiFetch,
  ValueTypes,
  profiles_constraint,
  order_by,
} from './zeusHasuraAdmin';

type TGql = ReturnType<typeof Thunder>;

export type TGiftCommon = {
  circle_id: number;
  epoch_id: number;
  note: string;
  recipient_address: string;
  recipient_id: number;
  sender_address: string;
  sender_id: number;
};

export class Gql {
  q: TGql;

  constructor(endpoint: string, hasuraSecret: string) {
    this.q = this.initQ(endpoint, hasuraSecret);
  }

  setHasuraParams(endpoint: string, hasuraSecret: string) {
    this.q = this.initQ(endpoint, hasuraSecret);
  }

  initQ(endpoint: string, hasuraSecret: string) {
    return Thunder(
      apiFetch([
        endpoint,
        {
          method: 'POST',
          headers: {
            'x-hasura-admin-secret': hasuraSecret,
          },
        },
      ])
    );
  }

  async getCircle(id: number) {
    return this.q('query')({
      circles_by_pk: [
        { id },
        {
          id: true,
          name: true,
          team_sel_text: true,
          discord_webhook: true,
          telegram_id: true,
          epochs: [
            { limit: 1 },
            {
              id: true,
              start_date: true,
              number: true,
              circle_id: true,
              ended: true,
              grant: true,
              created_at: true,
              days: true,
              repeat: true,
              repeat_day_of_month: true,
            },
          ],
        },
      ],
    });
  }

  async getCircles() {
    return (
      await this.q('query')({
        circles: [
          {},
          {
            id: true,
            name: true,
          },
        ],
      })
    ).circles;
  }

  // TODO: This is a big problem if we can't trust the type checker.
  // Why is the type inference wrong here,
  // It could be undefined
  async getProfileAndMembership(address: string) {
    return await this.q('query')({
      users: [
        {
          where: {
            address: {
              _eq: address,
            },
          },
        },
        {
          id: true,
          name: true,
          circle_id: true,
        },
      ],
      profiles: [
        {
          where: {
            address: {
              _eq: address,
            },
          },
        },
        {
          id: true,
          address: true,
        },
      ],
    });
  }

  // TODO: this isn't used, more of an idea, and for example.
  async updateCircles(
    circleId: number,
    circle: ValueTypes['circles_set_input']
  ) {
    return await this.q('mutation')({
      update_circles: [
        {
          where: {
            id: {
              _eq: circleId,
            },
          },
          _set: circle,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    });
  }

  async insertOrganizations(orgs: ValueTypes['organizations_insert_input'][]) {
    return this.q('mutation')({
      insert_organizations: [
        {
          objects: orgs,
        },
        {
          returning: {
            id: true,
            name: true,
            circles: [{}, { id: true }],
            circles_aggregate: [{}, { aggregate: { count: [{}, true] } }],
          },
        },
      ],
    });
  }

  async insertProfiles(profiles: ValueTypes['profiles_insert_input'][]) {
    return this.q('mutation')({
      insert_profiles: [
        {
          objects: profiles,
        },
        {
          returning: {
            address: true,
          },
        },
      ],
    });
  }

  async insertMemberships(users: ValueTypes['users_insert_input'][]) {
    return this.q('mutation')({
      insert_users: [
        {
          objects: users,
        },
        {
          returning: {
            id: true,
            address: true,
            circle_id: true,
            starting_tokens: true,
            non_giver: true,
            non_receiver: true,
            fixed_non_receiver: true,
          },
        },
      ],
    });
  }

  async insertEpochs(epochs: ValueTypes['epochs_insert_input'][]) {
    return this.q('mutation')({
      insert_epochs: [
        {
          objects: epochs,
        },
        {
          returning: {
            id: true,
            circle_id: true,
            ended: true,
            start_date: true,
            end_date: true,
          },
        },
      ],
    });
  }

  async insertGifts(gifts: ValueTypes['token_gifts_insert_input'][]) {
    return this.q('mutation')({
      insert_token_gifts: [
        {
          objects: gifts,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    });
  }

  async insertPendingGifts(
    gifts: ValueTypes['pending_token_gifts_insert_input'][]
  ) {
    return this.q('mutation')({
      insert_pending_token_gifts: [
        {
          objects: gifts,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    });
  }

  async insertNominees(nominees: ValueTypes['nominees_insert_input'][]) {
    return this.q('mutation')({
      insert_nominees: [
        { objects: nominees },
        {
          returning: {
            id: true,
          },
        },
      ],
    });
  }

  async getExpiredNominees() {
    return this.q('query')({
      nominees: [
        {
          where: {
            ended: {
              _eq: false,
            },
            expiry_date: { _lte: new Date() },
          },
        },
        {
          id: true,
          name: true,
          circle_id: true,
          nominations_aggregate: [{}, { aggregate: { count: [{}, true] } }],
        },
      ],
    });
  }

  async updateExpiredNominees(idList: number[]) {
    return this.q('mutation')({
      update_nominees: [
        {
          _set: {
            ended: true,
          },
          where: {
            id: {
              _in: idList,
            },
          },
        },
        {
          affected_rows: true,
          returning: {
            name: true,
            expiry_date: true,
          },
        },
      ],
    });
  }

  async insertCircleWithAdmin(
    circleInput: any,
    userAddress: string,
    coordinapeAddress: string
  ) {
    const insertProfiles = {
      objects: [{ address: userAddress }, { address: coordinapeAddress }],
      on_conflict: {
        constraint: profiles_constraint.profiles_address_key,
        update_columns: [],
      },
    };
    const insertUsers = {
      data: [
        {
          name: circleInput.user_name,
          address: userAddress,
          role: 1,
        },
        {
          name: 'Coordinape',
          address: coordinapeAddress,
          role: 2,
          non_receiver: false,
          fixed_non_receiver: false,
          starting_tokens: 0,
          non_giver: true,
          give_token_remaining: 0,
          bio: 'Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations.',
        },
      ],
    };
    const circleReturn = {
      id: true,
      name: true,
      protocol_id: true,
      team_sel_text: true,
      alloc_text: true,
      vouching: true,
      min_vouches: true,
      nomination_days_limit: true,
      vouching_text: true,
      logo: true,
      default_opt_in: true,
      team_selection: true,
      only_giver_vouch: true,
      auto_opt_out: true,
    };
    let retVal;
    if (circleInput.protocol_id) {
      const { insert_circles_one } = await this.q('mutation')({
        insert_circles_one: [
          {
            object: {
              name: circleInput.circle_name,
              protocol_id: circleInput.protocol_id,
              users: insertUsers,
            },
          },
          circleReturn,
        ],
        insert_profiles: [
          insertProfiles,
          {
            returning: {
              id: true,
            },
          },
        ],
      });
      retVal = insert_circles_one;
    } else {
      const { insert_organizations_one } = await this.q('mutation')({
        insert_organizations_one: [
          {
            object: {
              name: circleInput.protocol_name,
              circles: {
                data: [
                  {
                    name: circleInput.circle_name,
                    users: insertUsers,
                  },
                ],
              },
            },
          },
          {
            circles: [
              { limit: 1, order_by: [{ id: order_by.desc }] },
              circleReturn,
            ],
          },
        ],
        insert_profiles: [
          insertProfiles,
          {
            returning: {
              id: true,
            },
          },
        ],
      });

      retVal = insert_organizations_one?.circles.pop();
    }

    return retVal;
  }

  async checkAddressAdminInOrg(address: string, protocol_id: number) {
    const { profiles } = await this.q('query')({
      profiles: [
        {
          where: {
            address: { _ilike: address },
            users: {
              role: { _eq: 1 },
              circle: { protocol_id: { _eq: protocol_id } },
            },
          },
        },
        {
          id: true,
        },
      ],
    });
    return profiles.length > 0;
  }
}
