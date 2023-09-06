import assert from 'assert';
import { useState } from 'react';

import { EpochEndingNotification } from 'features/nav/EpochEndingNotification';
import { useParams } from 'react-router-dom';

import { ActivityList } from '../../features/activities/ActivityList';
import { SingleColumnLayout } from '../../ui/layouts';
import isFeatureEnabled from 'config/features';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { ContentHeader, Flex, Text } from 'ui';

export const CircleActivityPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const { circleId: circleIdS } = useParams();

  assert(circleIdS);

  const circleId = parseInt(circleIdS);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex
          column
          css={{
            gap: '$sm',
            flexGrow: 1,
            width: '100%',
          }}
        >
          <Flex alignItems="center" css={{ gap: '$sm' }}>
            <Text h1>Activity</Text>
            <EpochEndingNotification
              circleId={circleId}
              css={{ gap: '$sm' }}
              message="Contributions Due"
              showCountdown
            />
          </Flex>
          <Text p as="p">
            The latest in your circle.
          </Text>
          {isFeatureEnabled('activity_contributions') && (
            <ContributionForm
              circleId={circleId}
              showLoading={showLoading}
              onSave={() => setShowLoading(true)}
            />
          )}
        </Flex>
      </ContentHeader>
      <ActivityList
        queryKey={['circle-activities', circleId]}
        where={{ circle_id: { _eq: circleId } }}
        onSettled={() => setShowLoading(false)}
      />
    </SingleColumnLayout>
  );
};
