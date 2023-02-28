import { DateTime } from 'luxon';
import { NavLink } from 'react-router-dom';

import { Plus } from '../../icons/__generated';
import { paths } from '../../routes/paths';
import { Box, Flex, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { NewUser } from './useInfiniteActivities';

export const NewUserRow = ({ activity }: { activity: NewUser }) => {
  return (
    <Flex alignItems="center">
      <Box css={{ position: 'relative' }}>
        <ActivityAvatar profile={activity.target_profile} />
        <Box
          css={{
            position: 'absolute',
            borderRadius: 9999,
            background: '$dim',
            bottom: 4,
            left: -8,
            zIndex: '99',
            color: '$cta',
          }}
        >
          <Plus size="lg" />
        </Box>
      </Box>
      <Flex column css={{ flexGrow: 1, ml: '$md' }}>
        <ActivityProfileName profile={activity.target_profile} />

        <Flex>
          <Text inline color="cta" size="small">
            Added to Circle{' '}
            <Text
              semibold
              inline
              color="cta"
              size="small"
              as={NavLink}
              to={paths.history(activity.circle.id)}
              css={{ textDecoration: 'none' }}
            >
              {activity.circle.name}
            </Text>
          </Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
