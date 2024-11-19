import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { giveTrendingData } from '../../../_api/give/trending';
import { Flex, Text } from '../../ui';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

export const TopGiveSkills = () => {
  const { data, isFetched } = useQuery(
    ['TopGiveSkills'],
    async (): Promise<giveTrendingData> => {
      const res = await fetch('/api/give/trending');
      return res.json();
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (!isFetched) return null;

  return (
    <Flex column>
      <Text h2 display>
        Trending Give Skills
      </Text>
      {data?.map(g => (
        <Flex key={g.skill}>
          <Text
            as={NavLink}
            to={coLinksPaths.giveSkill(g.skill)}
            tag
            size="small"
            css={{
              gap: '$xs',
              background: 'rgb(0 143 94 / 83%)',
              textDecoration: 'none',
              span: {
                color: 'white',
                '@sm': {
                  fontSize: '$xs',
                },
              },
            }}
          >
            <GemCoOutline fa size={'md'} css={{ color: '$white' }} />
            <Text css={{ ...skillTextStyle }}>{g.skill}</Text>
          </Text>
          <Text
            css={{
              pl: '$md',
            }}
          >
            {g.gives_last_7_days}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
