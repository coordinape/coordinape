import { Text } from '../../ui';

import { ContributionRow } from './ContributionRow';
import { EpochCreatedRow } from './EpochCreatedRow';
import {
  Activity,
  IsContribution,
  IsEpochCreated,
  IsNewUser,
} from './getActivities';
import { NewUserRow } from './NewUserRow';

export const ActivityRow = ({ activity }: { activity: Activity }) => {
  if (IsContribution(activity)) {
    return <ContributionRow activity={activity} />;
  } else if (IsNewUser(activity)) {
    return <NewUserRow activity={activity} />;
  } else if (IsEpochCreated(activity)) {
    return <EpochCreatedRow activity={activity} />;
  }
  return <Text>Unknown activity: {activity.action}</Text>;
};
