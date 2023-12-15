import { client } from '../../lib/gql/client';

export const fetchSimilarityResults = async ({
  search,
}: {
  search: string;
}) => {
  const { searchProfiles } = await client.query(
    {
      searchProfiles: [
        {
          payload: { search_query: search, limit: 5 },
        },
        {
          similarity: true,
          profile_public: {
            id: true,
            name: true,
            avatar: true,
            address: true,
            links: true,
            reputation_score: {
              total_score: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'searchProfiles__searchBoxQuery',
    }
  );
  return searchProfiles;
};
