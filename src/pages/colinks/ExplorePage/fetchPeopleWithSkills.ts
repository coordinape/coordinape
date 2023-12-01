import { order_by } from '../../../lib/gql/__generated__/zeus';
import { client } from '../../../lib/gql/client';

const MAX_PEOPLE_WITH_SKILL = 100;
export const fetchPeopleWithSkill = async (
  skill: string,
  currentUserAddress: string
) => {
  const { profile_skills } = await client.query(
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
          profile_public: {
            avatar: true,
            name: true,
            id: true,
            address: true,
            description: true,
            links: true,
            links_held: true,
            link_target: [
              {
                where: {
                  holder: {
                    _eq: currentUserAddress,
                  },
                },
              },
              {
                amount: true,
              },
            ],
            profile_skills: [
              {},
              {
                skill_name: true,
              },
            ],
          },
        },
      ],
    },
    {
      operationName: 'explore_fetchSkills',
    }
  );
  // eslint-disable-next-line no-console
  console.log({ profile_skills });
  return profile_skills.map(ps => {
    const linkTarget = ps.profile_public?.link_target.pop();

    return { ...ps.profile_public, holdingAmount: linkTarget?.amount ?? 0 };
  });
};
export type ProfileForCard = NonNullable<
  Awaited<ReturnType<typeof fetchPeopleWithSkill>>[number]
>;
