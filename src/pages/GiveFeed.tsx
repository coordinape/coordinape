import { RecentGives } from 'features/colinks/RecentGives';
import { Helmet } from 'react-helmet';

import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

export const GiveFeed = () => {
  return (
    <SingleColumnLayout>
      <Helmet>
        <title>Give Feed / Coordinape</title>
      </Helmet>
      <ContentHeader>
        <Flex column>
          <Text h2 display>
            Recent Give
          </Text>
          <Text inline>
            Who <i>is</i> giving?
          </Text>
        </Flex>
      </ContentHeader>
      <Flex column css={{ mb: '$4xl', gap: '$2xl' }}>
        <RecentGives limit={35} />
      </Flex>
    </SingleColumnLayout>
  );
};
