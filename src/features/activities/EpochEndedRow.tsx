import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { Epoch } from '../../icons/__generated';
import { Avatar, Box, Button, Flex, Text } from '../../ui';
import { useIsInCircle } from 'hooks/migration';
import { paths } from 'routes/paths';

import { EpochEnded } from './useInfiniteActivities';

export const EpochEndedRow = ({ activity }: { activity: EpochEnded }) => {
  const showButton = useIsInCircle(activity.circle.id);
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
      <Box
        css={{ background: '$background', padding: '$lg', borderRadius: 9999 }}
      >
        <Epoch
          size="2xl"
          nostroke
          css={{
            mr: '$sm',
            ml: '-$lg',
            color: '$cta',
            transform: 'rotate(180deg)',
          }}
        />
      </Box>
      <Avatar
        size="small"
        css={{ flexShrink: 0, mr: '$sm' }}
        name={activity.circle.name}
        path={activity.circle.logo}
      />
      <Flex column>
        <Flex alignItems="center">
          <Text inline color="cta" size="small">
            Epoch {activity.epoch.number} Ended
          </Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
          {showButton && activity.epoch.ended && (
            <Button
              as={NavLink}
              to={paths.epochs(activity.circle.id)}
              css={{ ml: '$md' }}
            >
              Review
            </Button>
          )}
        </Flex>
        <Text>{activity.epoch.description} </Text>
      </Flex>
    </Flex>
  );
};
