import { client } from '../../lib/gql/client';

export const fetchSimilarCasts = async ({ search }: { search: string }) => {
  const { searchCasts } = await client.query(
    {
      searchCasts: [
        {
          payload: { search_query: search, limit: 20 },
        },
        {
          similarity: true,
          cast_id: true,
          enriched_cast: {
            id: true,
            text: true,
            hash: true,
            profile_public: {
              id: true,
              name: true,
              address: true,
              avatar: true,
            },
            timestamp: true,
          },
        },
      ],
    },
    {
      operationName: 'searchCasts__searchBoxQuery',
    }
  );
  return searchCasts;
};
