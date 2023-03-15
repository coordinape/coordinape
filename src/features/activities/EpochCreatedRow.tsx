import { DateTime } from 'luxon';

import { Epoch } from '../../icons/__generated';
import { Avatar, Box, Flex, Text } from '../../ui';

import { EpochCreated } from './useInfiniteActivities';

export const EpochCreatedRow = ({ activity }: { activity: EpochCreated }) => {
  return (
    <Flex
      css={{
        // borderTop: '1px solid $dim',
        // borderBottom: '1px solid $dim',
        alignItems: 'center',
        ml: '$md',
      }}
    >
      <Box
        css={{ background: '$background', padding: '$lg', borderRadius: 9999 }}
      >
        <Epoch
          size="2xl"
          nostroke
          css={{ mr: '$sm', ml: '-$lg', color: '$cta' }}
        />
      </Box>
      <Avatar
        size="medium"
        css={{ flexShrink: 0, mr: '$sm' }}
        name={activity.circle.name}
        path={activity.circle.logo}
      />

      <Flex column>
        <Flex>
          <Text
            color={'heading'}
            semibold={true}
            css={{ textDecoration: 'none' }}
          >
            {activity.circle.name}
          </Text>
          <Text css={{ mx: '$sm', color: '$cta' }}>Epoch Created</Text>
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
