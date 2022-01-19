import { Thunder, apiFetch, ValueTypes } from './zeusUser';

type TGql = ReturnType<typeof Thunder>;

export class Gql {
  q: TGql;
  endpoint: string;

  constructor(endpoint: string, token: string) {
    this.q = this.initQ(token);
    this.endpoint = endpoint;
  }

  setToken(token?: string) {
    this.q = this.initQ(token);
  }

  initQ(token?: string) {
    return Thunder(
      apiFetch(
        token
          ? [
              this.endpoint,
              {
                method: 'POST',
                headers: {
                  Authorization: 'Bearer ' + token,
                },
              },
            ]
          : [this.endpoint]
      )
    );
  }

  async updateProfile(id: number, profile: ValueTypes['profiles_set_input']) {
    return this.q('mutation')({
      update_profiles_by_pk: [
        { set: profile, pk_columns: { id } },
        {
          id: true,
          admin_view: true,
        },
      ],
    });
  }
}
