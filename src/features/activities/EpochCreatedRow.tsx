import { DateTime } from 'luxon';

import { Epoch } from '../../icons/__generated';
import { Avatar, Flex, Text } from '../../ui';

import { EpochCreated } from './useInfiniteActivities';

export const EpochCreatedRow = ({ activity }: { activity: EpochCreated }) => {
  return (
    <Flex
      css={{
        // borderTop: '1px solid $dim',
        // borderBottom: '1px solid $dim',
        py: '$md',
        alignItems: 'center',
        ml: '$md',
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
          <Text
            color={'heading'}
            semibold={true}
            css={{ textDecoration: 'none' }}
          >
            {activity.circle.name}
          </Text>
          <Text css={{ mx: '$sm' }}>Epoch Created</Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
        {/*<Text>{activity.epoch.description} </Text>*/}
        <Text inline>
          Starts {DateTime.fromISO(activity.epoch.start_date).toRelative()} -
          Ends {DateTime.fromISO(activity.epoch.end_date).toRelative()}
        </Text>
      </Flex>
    </Flex>
  );
};
