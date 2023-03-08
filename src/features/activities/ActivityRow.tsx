import { Flex, Text } from '../../ui';

import { ContributionRow } from './ContributionRow';
import { DeletedRow } from './DeletedRow';
import { EpochCreatedRow } from './EpochCreatedRow';
import { EpochEndedRow } from './EpochEndedRow';
import { EpochStartedRow } from './EpochStartedRow';
import { NewUserRow } from './NewUserRow';
import {
  Activity,
  IsContribution,
  IsDeleted,
  IsEpochCreated,
  IsEpochEnded,
  IsEpochStarted,
  IsNewUser,
} from './useInfiniteActivities';

export const ActivityRow = ({ activity }: { activity: Activity }) => {
  const valid = validActivity(activity);
  if (!valid) {
    if (IsDeleted(activity)) {
      return <DeletedRow activity={activity} />;
    } else {
      // TODO: send these to Sentry when this goes into production
      return <Text>Unknown activity: {activity.action}</Text>;
    }
  }

  return (
    <Flex column css={{ transition: '1.0s all ease-out' }}>
      {valid}
    </Flex>
  );
};

const validActivity = (activity: Activity) => {
  if (IsContribution(activity)) {
    return <ContributionRow activity={activity} />;
  } else if (IsNewUser(activity)) {
    return <NewUserRow activity={activity} />;
  } else if (IsEpochCreated(activity)) {
    return <EpochCreatedRow activity={activity} />;
  } else if (IsEpochStarted(activity)) {
    return <EpochStartedRow activity={activity} />;
  } else if (IsEpochEnded(activity)) {
    return <EpochEndedRow activity={activity} />;
  }
  return undefined;
};
