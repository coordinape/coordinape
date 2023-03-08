import { DateTime } from 'luxon';

import { Epoch } from '../../icons/__generated';
import { Avatar, Flex, Text } from '../../ui';

import { EpochStarted } from './useInfiniteActivities';

export const EpochStartedRow = ({ activity }: { activity: EpochStarted }) => {
  return (
    <Flex
      css={{
        borderTop: '1px solid $dim',
        borderBottom: '1px solid $dim',
        py: '$md',
        alignItems: 'center',
      }}
    >
      <Avatar
        // size="xs"
        css={{ flexShrink: 0 }}
        name={activity.circle.name}
        path={activity.circle.logo}
      />
      <Epoch size="lg" nostroke css={{ mx: '$md' }} />
      <Flex column>
        <Flex>
          <Text inline color="cta" size="small">
            Epoch {activity.epoch.number} Started
          </Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
        <Text>{activity.epoch.description} </Text>
      </Flex>
    </Flex>
  );
};
