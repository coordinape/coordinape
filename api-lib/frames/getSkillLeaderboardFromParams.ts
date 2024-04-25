/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert';

import { order_by } from '../gql/__generated__/zeus';
import { adminClient } from '../gql/adminClient';

export const getSkillLeaderboardFromParams = async (
  params: Record<string, string>
) => {
  const skill = 'project-management';

  let leaderboard;

  if (skill) {
    leaderboard = await getSkillLeaderboard(skill);
  }

  return { ...(leaderboard && { leaderboard }) };
};

const getSkillLeaderboard = async (skill: string) => {
  const { colinks_gives_skill_count } = await adminClient.query(
    {
      colinks_gives_skill_count: [
        {
          where: {
            skill: {
              _ilike: skill,
            },
          },
          order_by: [
            {
              gives: order_by.desc_nulls_last,
            },
            {
              target_profile_public: {
                name: order_by.asc_nulls_last,
              },
            },
          ],
          limit: 5,
        },
        {
          target_profile_public: {
            name: true,
            avatar: true,
            address: true,
          },
          gives: true,
          gives_last_24_hours: true,
          gives_last_7_days: true,
          gives_last_30_days: true,
        },
      ],
    },
    {
      operationName: 'getGiveLeaderboard',
    }
  );

  assert(
    colinks_gives_skill_count,
    'skill not found in frame__getContextFromParams'
  );

  return colinks_gives_skill_count;
};
