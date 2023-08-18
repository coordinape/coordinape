import assert from 'assert';
import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { ActivityList } from '../../features/activities/ActivityList';
import { SingleColumnLayout } from '../../ui/layouts';
import { ContributionForm } from 'pages/ContributionsPage/ContributionForm';
import { ContentHeader, Flex, Text } from 'ui';

export const CircleActivityPage = () => {
  const { circleId: circleIdS } = useParams();

  assert(circleIdS);

  const circleId = parseInt(circleIdS);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleFormSubmit = () => {
    setFormSubmitted(true);
  };
  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Activity</Text>
          <Text p as="p">
            The latest in your circle
          </Text>
        </Flex>
      </ContentHeader>
      <ContributionForm onFormSubmit={handleFormSubmit} />
      <ActivityList
        queryKey={['circle-activities', circleId, formSubmitted]}
        where={{ circle_id: { _eq: circleId } }}
      />
    </SingleColumnLayout>
  );
};
