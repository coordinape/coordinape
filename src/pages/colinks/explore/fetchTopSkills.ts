import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { anonClient } from '../../../lib/anongql/anonClient';

const MAX_POTENTIAL_SKILLS = 100;

export const fetchTopSkills = async (skillName: string | undefined) => {
  const { skills } = await anonClient.query(
    {
      skills: [
        {
          order_by: [{ count: order_by.desc }, { name: order_by.asc }],
          limit: MAX_POTENTIAL_SKILLS,
          where: skillName
            ? {
                name: {
                  _ilike: skillName,
                },
              }
            : undefined,
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
