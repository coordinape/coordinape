import { Leaderboard } from '../../features/colinks/Leaderboard';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const LeaderboardPage = () => {
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Leaderboard
          </Text>
          <Text>Who is the most linked up?</Text>
        </Flex>
      </ContentHeader>
      <Flex
        css={{ display: 'grid', gap: '$4xl', gridTemplateColumns: '1fr 1fr' }}
      >
        <Flex column css={{ gap: '$xl' }}>
          <Text semibold>Most Link Holders</Text>
          <Leaderboard limit={100} board={'targets'} />
        </Flex>
        <Flex column css={{ gap: '$xl' }}>
          <Text semibold>Holding Most Links</Text>
          <Leaderboard limit={100} board={'holders'} />
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
