import { useQuery } from 'react-query';

import { order_by } from '../../lib/anongql/__generated__/zeus';
import { anonClient } from '../../lib/anongql/anonClient';

export const useGiveSkills = (search: string) => {
  const { data } = useQuery(['give_skill_search', search], async () => {
    if (!search) {
      return [];
    }
    const { colinks_give_count } = await anonClient.query(
      {
        colinks_give_count: [
          {
            where: {
              skill: { _ilike: '%' + search + '%' },
            },
            order_by: [
              {
                gives: order_by.desc_nulls_last,
              },
              {
                skill: order_by.asc_nulls_last,
              },
            ],
            limit: 10,
          },
          {
            skill: true,
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
    return colinks_give_count.map((skill, rank) => ({
      ...skill,
      rank: rank + 1,
    }));
  });

  return data;
};
