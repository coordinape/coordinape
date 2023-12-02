import { order_by } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

const MAX_POTENTIAL_SKILLS = 100;

export const fetchTopSkills = async () => {
  const { skills } = await client.query(
    {
      skills: [
        {
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
