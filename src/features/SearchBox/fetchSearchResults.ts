import { order_by, ValueTypes } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';

type ProfilesWhere = ValueTypes['profiles_public_bool_exp'];
type SkillsWhere = ValueTypes['skills_bool_exp'];

export const fetchSearchResults = async ({
  where,
  skillsWhere,
}: // contributionsWhere,
{
  where: ProfilesWhere;
  skillsWhere: SkillsWhere;
  // contributionsWhere?: ProfilesWhere;
}) => {
  const { profiles_public, skills } = await client.query(
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
    },
    {
      operationName: 'searchBoxQuery',
    }
  );
  return { profiles_public, interests: skills };
};
