import { NavLink } from 'react-router-dom';

import { CoLinksHistory } from '../../features/colinks/CoLinksHistory';
import { LeaderboardHoldingMost } from '../../features/colinks/LeaderboardHoldingMost';
import { LeaderboardMostLinks } from '../../features/colinks/LeaderboardMostLinks';
import { Users } from '../../icons/__generated';
import { coLinksPaths } from '../../routes/paths';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

import { Skills } from './explore/Skills';

export const ExplorePage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Explore
          </Text>
          <Text inline>
            Who <i>are</i> these people?
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <Flex
          css={{
            display: 'grid',
            gap: '$4xl',
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Flex column css={{ gap: '$xl' }}>
            <Text
              as={NavLink}
              to={coLinksPaths.exploreMostLinks}
              semibold
              h2
              css={{
                textDecoration: 'none',
                color: '$text',
              }}
            >
              <Flex
                css={{
                  // justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '$md',
                  width: '100%',
                }}
              >
                <Users /> Most Links
                <Text size="xs" color={'cta'}>
                  View More
                </Text>
              </Flex>
            </Text>
            <LeaderboardMostLinks limit={100} />
          </Flex>
          <Flex column css={{ gap: '$xl' }}>
            <Text
              as={NavLink}
              to={coLinksPaths.exploreHoldingMost}
              semibold
              css={{ textDecoration: 'none', color: '$text' }}
            >
              Holding Most Links
            </Text>
            <LeaderboardHoldingMost limit={100} />
          </Flex>
        </Flex>
        <Flex
          css={{
            display: 'grid',
            gap: '$2xl',
            gridTemplateColumns: '6fr 2fr',
          }}
        >
          <Flex column css={{ gap: '$xl' }}>
            <Flex
              as={NavLink}
              to={coLinksPaths.exploreSkills}
              css={{ textDecoration: 'none', color: '$text' }}
            >
              <Text semibold>Top Interests</Text>
            </Flex>
            <Skills />
          </Flex>
          <Flex column css={{ gap: '$xl' }}>
            <Flex
              as={NavLink}
              to={coLinksPaths.trades}
              css={{ textDecoration: 'none', color: '$text' }}
            >
              <Text semibold>Linking Activity</Text>
            </Flex>

            <CoLinksHistory />
          </Flex>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
