import { useState } from 'react';

import { ActivityList } from '../features/activities/ActivityList';
import { RightColumnSection } from '../features/soulkeys/RightColumnSection';
import { SoulKeyHistory } from '../features/soulkeys/SoulKeyHistory';
import { ContentHeader, Flex, Text } from '../ui';
import { SingleColumnLayout } from '../ui/layouts';

import { ContributionForm } from './ContributionsPage/ContributionForm';

export const SoulKeyActivityPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  return (
    <SingleColumnLayout css={{ flexGrow: 1 }}>
      <Flex css={{ gap: '$lg' }}>
        <Flex css={{ flex: 2 }} column>
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
                placeholder={
                  'Share what you are working on with your community'
                }
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
        </Flex>
        <Flex css={{ flex: 1 }}>
          <RightColumnSection title="Recent Key Transactions">
            <SoulKeyHistory />
          </RightColumnSection>
        </Flex>
      </Flex>
    </SingleColumnLayout>
  );
};
