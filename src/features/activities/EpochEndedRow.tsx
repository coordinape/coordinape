import { DateTime } from 'luxon';

import { Epoch } from '../../icons/__generated';
import { Flex, Text } from '../../ui';

import { EpochEnded } from './useInfiniteActivities';

export const EpochEndedRow = ({ activity }: { activity: EpochEnded }) => {
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
            Epoch {activity.epoch.number} Ended
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
