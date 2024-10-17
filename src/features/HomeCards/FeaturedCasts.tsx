import { LoadingIndicator } from '../../components/LoadingIndicator';
import { Flex, Panel, Text } from '../../ui';
import { ActivityRow } from '../activities/ActivityRow';
import { Activity } from '../activities/useInfiniteActivities';

export const FeaturedCasts = ({
  title,
  activities,
}: {
  title: string;
  activities: Activity[] | undefined;
}) => {
  return (
    <Panel neutral>
      <Flex column css={{ gap: '$md' }}>
        <Text tag size="large" css={{ fontWeight: '$bold' }}>
          {title}
        </Text>
        {!activities ? (
          <LoadingIndicator />
        ) : (
          activities.map(a => <ActivityRow key={a.id} activity={a} />)
        )}
      </Flex>
    </Panel>
  );
};
