import { RecentGives } from 'features/colinks/RecentGives';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { skillTextStyle } from 'stitches.config';

import { giveTrendingData } from '../../../_api/give/trending';
import { AppLink, Flex, Text } from '../../ui';
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
          {/* <Flex css={{ gap: '$sm' }}>
            <Text
              as={NavLink}
              to={coLinksPaths.giveSkill(g.skill)}
              tag
              size="large"
              color="complete"
              css={{
                gap: '$sm',
                fontSize: '$h2',
                p: '$sm $md',
                height: 'auto',
                textDecoration: 'none',
                span: {
                  '@sm': {
                    fontSize: '$xs',
                  },
                },
              }}
            >
              <GemCoOutline fa size={'xl'} />
              <Text css={{ ...skillTextStyle }}>{g.skill}</Text>
            </Text>
            <Text variant="label" css={{ textTransform: 'uppercase' }}>
              Top Skill
            </Text>
          </Flex> */}
          <RecentGives skill={g.skill} limit={5} />
          <AppLink
            inlineLink
            to={coLinksPaths.giveSkill(g.skill)}
            css={{
              gap: '$sm',
              height: 'auto',
              textDecoration: 'none',
              textTransform: 'capitalize',
              width: '100%',
              textAlign: 'center',
            }}
          >
            View More {g.skill}
          </AppLink>
        </Flex>
      ))}
    </Flex>
  );
};
