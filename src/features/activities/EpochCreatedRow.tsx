import { DateTime } from 'luxon';

import { Epoch } from '../../icons/__generated';
import { Flex, Text } from '../../ui';

import { EpochCreated } from './useInfiniteActivities';

export const EpochCreatedRow = ({ activity }: { activity: EpochCreated }) => {
  return (
    <Flex
      css={{
        borderTop: '1px solid $dim',
        borderBottom: '1px solid $dim',
        py: '$md',
        alignItems: 'center',
      }}
    >
      <Epoch size="xl" nostroke css={{ mr: '$lg', ml: '$sm' }} />
      <Flex column>
        <Flex>
          <Text inline color="cta" size="small">
            New Epoch {activity.epoch.number} Created
            {activity.actor_profile && ' by ' + activity.actor_profile.name}
          </Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
        <Text>{activity.epoch.description} </Text>
        <Text inline>
          Starts {DateTime.fromISO(activity.epoch.start_date).toRelative()} -
          Ends {DateTime.fromISO(activity.epoch.end_date).toRelative()}
        </Text>
      </Flex>
    </Flex>
  );
};
