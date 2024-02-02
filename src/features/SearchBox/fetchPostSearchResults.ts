import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

export const fetchPostSearchResults = async ({
  search,
}: // contributionsWhere,
{
  search?: string;
  // contributionsWhere?: ProfilesWhere;
}) => {
  const { search_contributions } = await client.query(
    {
      search_contributions: [
        {
          args: {
            search: search,
            result_limit: 5,
          },
          order_by: [{ created_at: order_by.desc }],
          // where: {
          //   ...contributionsWhere,
          // },
        },
        {
          activity: {
            id: true,
          },
          description: true,
          created_at: true,
          profile_public: {
            name: true,
            avatar: true,
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'searchBoxQueryPosts',
    }
  );
  return { posts: search_contributions };
};
