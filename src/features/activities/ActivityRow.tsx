import { Text } from '../../ui';

import { DisplayContext } from './ActivityList';
import { ContributionRow } from './ContributionRow';
import { EpochCreatedRow } from './EpochCreatedRow';
import { NewUserRow } from './NewUserRow';
import {
  Activity,
  IsContribution,
  IsEpochCreated,
  IsNewUser,
} from './useInfiniteActivities';

export const ActivityRow = ({
  activity,
  displayContext,
}: {
  activity: Activity;
  displayContext: DisplayContext;
}) => {
  if (IsContribution(activity)) {
    return (
      <ContributionRow activity={activity} displayContext={displayContext} />
    );
  } else if (IsNewUser(activity)) {
    return <NewUserRow activity={activity} />;
  } else if (IsEpochCreated(activity)) {
    return <EpochCreatedRow activity={activity} />;
  }
  // TODO: send these to Sentry when this goes into production
  return <Text>Unknown activity: {activity.action}</Text>;
};
