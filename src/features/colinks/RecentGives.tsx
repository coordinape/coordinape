import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { order_by } from '../../lib/anongql/__generated__/zeus';
import { Flex, Text } from 'ui';

const QUERY_KEY_RECENT_GIVES = 'recentGives';

export const RecentGives = ({ skill }: { skill: string }) => {
  const { data } = useQuery([QUERY_KEY_RECENT_GIVES, skill], async () => {
    const { colinks_gives } = await anonClient.query(
      {
        colinks_gives: [
          {
            where: { skill: { _eq: skill } },
            order_by: [{ created_at: order_by.desc_nulls_last }],
            limit: 10,
          },
          {
            created_at: true,
            id: true,
            skill: true,
            skill_name: true,
            giver_profile_public: { name: true },
          },
        ],
      },
      {
        operationName: 'coLinks_recent_gives @cached(ttl: 30)',
      }
    );
    return colinks_gives;
  });
  return (
    <Flex column css={{ gap: '$md' }}>
      Recent Gives
      {data?.map(give => (
        <Text key={give.id}>
          {skill} given at {give.created_at}
        </Text>
      ))}
    </Flex>
  );
};
