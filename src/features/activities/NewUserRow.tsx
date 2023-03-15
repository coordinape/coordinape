import { DateTime } from 'luxon';

import { Member } from '../../icons/__generated';
import { Box, Flex, Text } from '../../ui';

import { ActivityAvatar } from './ActivityAvatar';
import { ActivityProfileName } from './ActivityProfileName';
import { CircleLogoWithName } from './CircleLogoWithName';
import { NewUser } from './useInfiniteActivities';

export const NewUserRow = ({ activity }: { activity: NewUser }) => {
  return (
    <Flex alignItems="center" css={{ ml: '$md', position: 'relative' }}>
      <Box css={{ ml: '$sm' }}>
        <ActivityAvatar profile={activity.target_profile} size="small" />
        {/*<Box*/}
        {/*  css={{*/}
        {/*    position: 'absolute',*/}
        {/*    borderRadius: 9999,*/}
        {/*    background: '$dim',*/}
        {/*    bottom: 4,*/}
        {/*    left: -8,*/}
        {/*    zIndex: '99',*/}
        {/*    color: '$cta',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Plus size="lg" />*/}
        {/*</Box>*/}
      </Box>
      <Flex css={{ flexGrow: 1, ml: '$2xl' }}>
        <Flex alignItems="center">
          <Text css={{ mr: '$md' }}>
            <Member nostroke size="lg" />
          </Text>

          <ActivityProfileName profile={activity.target_profile} />
          <Text inline color="neutral" size="small" css={{ mx: '$sm' }}>
            joined
          </Text>
          <CircleLogoWithName circle={activity.circle} variant="heading" />
          <Text inline size="small" css={{ ml: '$md', color: '$neutral' }}>
            {DateTime.fromISO(activity.created_at).toRelative()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
