import assert from 'assert';
import { useState } from 'react';

import { EpochEndingNotification } from 'features/nav/EpochEndingNotification';
import {
  getCircleData,
  QUERY_KEY_CIRCLE_DATA,
} from 'features/orgs/getCircleData';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { ActivityList } from '../../features/activities/ActivityList';
import { SingleColumnLayout } from '../../ui/layouts';
import isFeatureEnabled from 'config/features';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { Avatar, ContentHeader, Flex, Text } from 'ui';

export const CircleActivityPage = () => {
  const [showLoading, setShowLoading] = useState(false);
  const { circleId: circleIdS } = useParams();

  assert(circleIdS);

  const circleId = parseInt(circleIdS);
  const query = useQuery(
    [QUERY_KEY_CIRCLE_DATA, circleId],
    () => getCircleData(circleId as number),
    { enabled: !!circleId, staleTime: Infinity }
  );
  const circle = query.data?.circles_by_pk;

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
            <Text h1 css={{ gap: '$sm' }}>
              <Avatar
                path={circle?.logo}
                size="small"
                name={circle?.name || ''}
              />
              {circle?.name || ''} Activity
            </Text>
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
