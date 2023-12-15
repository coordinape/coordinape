import { order_by, ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

type ProfilesWhere = ValueTypes['profiles_public_bool_exp'];
type SkillsWhere = ValueTypes['skills_bool_exp'];

export const fetchSearchResults = async ({
  where,
  skillsWhere,
  search,
}: // contributionsWhere,
{
  where: ProfilesWhere;
  skillsWhere: SkillsWhere;
  search?: string;
  // contributionsWhere?: ProfilesWhere;
}) => {
  const { profiles_public, skills, search_contributions } = await client.query(
    {
      profiles_public: [
        {
          where: {
            ...where,
            links_held: { _gt: 0 },
          },
          limit: 5,
          order_by: [{ links: order_by.desc }],
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          links: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
      skills: [
        {
          where: skillsWhere,
          limit: 5,
          order_by: [{ count: order_by.desc }],
        },
        {
          name: true,
          count: true,
        },
      ],
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
          id: true,
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
      operationName: 'searchBoxQuery',
    }
  );
  return { profiles_public, interests: skills, posts: search_contributions };
};
