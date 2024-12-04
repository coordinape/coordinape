import { RecentGives } from 'features/colinks/RecentGives';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { giveTrendingData } from '../../../_api/give/trending';
import { Flex, Text } from '../../ui';
import { GemCoOutline } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';

export const TopGiveSkills = ({
  tier,
}: {
  tier: 'first' | 'second' | 'third';
}) => {
  const { data, isFetched } = useQuery(
    ['TierGiveSkills'],
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

  // Define the tier ranges
  const tierRanges = {
    first: [0, 1],
    second: [1, 2],
    third: [2, 3],
  };

  const [startIndex, endIndex] = tierRanges[tier];

  // Get skills in the specified tier
  const tierSkills = data?.slice(startIndex, endIndex);

  return (
    <Flex column>
      <Text h2 display>
        {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier Give Skills
      </Text>
      {tierSkills?.map(g => (
        <Flex column key={g.skill} gap="md">
          <Flex>
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
              inline
              h1
              css={{
                pl: '$md',
              }}
            >
              {g.gives_last_7_days}
            </Text>
          </Flex>
          <RecentGives skill={g.skill} limit={5} />
        </Flex>
      ))}
    </Flex>
  );
};
