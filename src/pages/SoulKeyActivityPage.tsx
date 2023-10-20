import { useState } from 'react';

import { ActivityList } from '../features/activities/ActivityList';
import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

import { ContributionForm } from './ContributionsPage/ContributionForm';

export const SoulKeyActivityPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  return (
    <SingleColumnLayout css={{ flexGrow: 1, maxWidth: '$readable' }}>
      <ContentHeader>
        <Flex
          column
          css={{
            gap: '$md',
            flexGrow: 1,
            alignItems: 'flex-start',
          }}
        >
          <Text h2 display>
            Activity Stream
          </Text>
          <ContributionForm
            privateStream={true}
            showLoading={showLoading}
            placeholder={'Share what you are working on with your community'}
            onSave={() => setShowLoading(true)}
          />
        </Flex>
      </ContentHeader>
      <Flex>
        <ActivityList
          queryKey={['soulkey_activity']}
          where={{ private_stream: { _eq: true } }}
          onSettled={() => setShowLoading(false)}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
