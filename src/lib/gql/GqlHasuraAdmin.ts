import { Thunder, apiFetch, ValueTypes } from './zeusHasuraAdmin';

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

  async getCircle() {
    return this.q('query')({
      circles_by_pk: [
        { id: 0 },
        {
          id: true,
          name: true,
          team_sel_text: true,
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
}
