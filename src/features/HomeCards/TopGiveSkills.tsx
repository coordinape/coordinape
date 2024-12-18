import { RecentGives } from 'features/colinks/RecentGives';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { giveTrendingData } from '../../../_api/give/trending';
import { Button, Flex, Text } from '../../ui';
import { GemCoOutline } from 'icons/__generated';
import { QUERY_KEY_GIVE_HOME } from 'pages/GiveHome';
import { coLinksPaths } from 'routes/paths';

export const TopGiveSkills = ({
  tier,
}: {
  tier: 'first' | 'second' | 'third';
}) => {
  const { data, isFetched } = useQuery(
    [QUERY_KEY_GIVE_HOME, 'topGiveSkills'],
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
    <Flex column css={{ position: 'relative' }}>
      {tierSkills?.map(g => (
        <Flex column key={g.skill} gap="md">
          <Flex
            column
            as={NavLink}
            to={coLinksPaths.giveSkill(g.skill)}
            css={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '$3',
              background: '$background',
              p: '$md',
              color: '$text',
              textDecoration: 'none',
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                gap: '$sm',
              }}
            >
              <GemCoOutline fa size={'xl'} />
              <Text
                h2
                display
                css={{
                  ...skillTextStyle,
                  maxWidth: '300px',
                  color: '$text',
                  textTransform: 'capitalize',
                }}
              >
                {g.skill}
                <br />
                <Text size="small">Trending Skill</Text>
              </Text>
            </Flex>
          </Flex>
          <RecentGives skill={g.skill} limit={5} />
          <Flex css={{ justifyContent: 'center', width: '100%' }}>
            <Button
              size="xs"
              as={NavLink}
              to={coLinksPaths.giveSkill(g.skill)}
              color="primary"
              css={{
                textTransform: 'capitalize',
              }}
            >
              View More {g.skill}
            </Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
