import assert from 'assert';

import { useParams } from 'react-router-dom';

import { ActivityList } from '../../features/activities/ActivityList';
import { ContentHeader, Flex, Text } from '../../ui';
import { SingleColumnLayout } from '../../ui/layouts';

export const CircleActivityPage = () => {
  const { circleId: circleIdS } = useParams();

  assert(circleIdS);

  const circleId = parseInt(circleIdS);

  return (
    <SingleColumnLayout>
      <ContentHeader>
        <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
          <Text h1>Activity</Text>
          <Text p as="p">
            See what&apos;s up!!
          </Text>
        </Flex>
      </ContentHeader>
      <ActivityList
        queryKey={['circle-activities', circleId]}
        where={{ circle_id: { _eq: circleId } }}
        displayContext={{ showCircleInfo: false }}
      />
    </SingleColumnLayout>
  );
};
