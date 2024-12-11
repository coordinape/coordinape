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
    <Flex column css={{}}>
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
              mb: '$md',
              borderRadius: '$3',
              background: '$tagSuccessBackground',
              p: '$md',
              color: '$tagSuccessText',
              textDecoration: 'none',
            }}
          >
            <Flex
              css={{
                alignItems: 'center',
                gap: '$sm',
                pb: '$xs',
                borderBottom: '1px solid $tagSuccessText',
              }}
            >
              <GemCoOutline fa size={'xl'} />
              <Text
                h2
                display
                css={{
                  ...skillTextStyle,
                  maxWidth: '300px',
                  color: '$tagSuccessText',
                }}
              >
                {g.skill}
              </Text>
            </Flex>
            <Text
              size="small"
              css={{
                mt: '$sm',
                height: 'auto',
                color: '$tagSuccessText',
              }}
            >
              Top GIVE
            </Text>
          </Flex>
          <RecentGives skill={g.skill} limit={5} />
          <Flex css={{ justifyContent: 'center', width: '100%' }}>
            <Button
              as={NavLink}
              to={coLinksPaths.giveSkill(g.skill)}
              color="secondary"
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
