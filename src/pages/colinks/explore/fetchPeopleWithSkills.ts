import { order_by } from '../../../lib/anongql/__generated__/zeus';
import { anonClient } from '../../../lib/anongql/anonClient';

import { coLinksMemberSelector } from './CoLinksMember';

const MAX_PEOPLE_WITH_SKILL = 100;
export const fetchPeopleWithSkill = async (
  skill: string,
  currentUserAddress?: string
) => {
  const { profile_skills } = await anonClient.query(
    {
      profile_skills: [
        {
          where: {
            skill_name: {
              _eq: skill,
            },
          },
          order_by: [{ profile_public: { links: order_by.desc } }],
          limit: MAX_PEOPLE_WITH_SKILL,
        },
        {
          profile_public: coLinksMemberSelector(currentUserAddress),
        },
      ],
    },
    {
      operationName: 'explore_fetchSkills',
    }
  );
  return profile_skills.map(ps => ps.profile_public);
};

export type ProfileForCard = NonNullable<
  Awaited<ReturnType<typeof fetchPeopleWithSkill>>[number]
>;
