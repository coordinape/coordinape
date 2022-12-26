import { client } from 'lib/gql/client';

export const getUserActiveEpochs = async (profileId: number) => {
  return await client.query({
    profiles_by_pk: [
      {
        id: profileId,
      },
      {
        users: [
          {
            where: { deleted_at: { _is_null: true } },
          },
          {
            circle: {
              epochs: [
                {
                  where: {
                    _and: [
                      { ended: { _eq: false } },
                      { start_date: { _lt: 'now' } },
                      {
                        circle: {
                          organization: {
                            name: { _neq: 'Sample DAO' },
                          },
                        },
                      },
                    ],
                  },
                },
                { id: true },
              ],
            },
          },
        ],
      },
    ],
  });
};

export const QUERY_KEY_USER_ACTIVE_EPOCHS = 'getUserActiveEpochs';
