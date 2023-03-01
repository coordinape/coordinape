import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { Epoch, Give } from '../../icons/__generated';
import { Button, Flex, Text } from '../../ui';
import { paths } from 'routes/paths';

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
      <Epoch size="xl" nostroke css={{ mr: '$lg', ml: '$sm' }} />
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
      <Button
        css={{ ml: '$xl' }}
        as={NavLink}
        to={paths.give(activity.epoch.circle_id)}
      >
        <Give nostroke />
        Give to Teammates{' '}
      </Button>
    </Flex>
  );
};
