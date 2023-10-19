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
            onSave={() => setShowLoading(true)}
          />
        </Flex>
      </ContentHeader>
      <Flex>
        <ActivityList
          queryKey={['soulkey_activity']}
          where={{ private_stream: { _eq: true } }}
        />
      </Flex>
    </SingleColumnLayout>
  );
};
