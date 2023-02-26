import { DateTime } from 'luxon';

import { Plus } from '../../icons/__generated';
import { Avatar, Box, Flex, Text } from '../../ui';

import { NewUser } from './getActivities';

export const NewUserRow = ({ activity }: { activity: NewUser }) => {
  return (
    <Flex alignItems="center">
      <Box css={{ position: 'relative' }}>
        <Avatar
          css={{ flexShrink: 0 }}
          name={activity.target_profile.name}
          path={activity.target_profile.avatar}
        />
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
        <Flex css={{ gap: '$sm' }}>
          <Text variant="label">{activity.target_profile.name}</Text>
        </Flex>

        <Flex>
          <Text inline color="cta" size="small">
            Added to Circle
          </Text>
          <Text inline size="small" css={{ ml: '$xs', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
