import { order_by, ValueTypes } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

const MAX_POTENTIAL_SKILLS = 100;

export type Where = ValueTypes['skills_bool_exp'];
export const fetchTopSkills = async ({ where }: { where: Where }) => {
  const { skills } = await client.query(
    {
      skills: [
        {
          where,
          order_by: [{ count: order_by.desc }, { name: order_by.asc }],
          limit: MAX_POTENTIAL_SKILLS,
        },
        {
          name: true,
          count: true,
        },
      ],
    },
    {
      operationName: 'explore_fetchSkills',
    }
  );
  return skills;
};
