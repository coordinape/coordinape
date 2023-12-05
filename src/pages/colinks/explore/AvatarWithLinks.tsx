import { ComponentProps } from 'react';

import { Award } from '../../../icons/__generated';
import { Avatar, Box, Flex, Text } from '../../../ui';

export const AvatarWithLinks = ({
  profile,
  size = 'large',
}: {
  size?: ComponentProps<typeof Avatar>['size'];
  profile: { name?: string; avatar?: string; links?: number };
}) => {
  return (
    <Box
      css={{
        position: 'relative',
        width: size === 'large' ? '$2xl' : '40px',
        height: size === 'large' ? '$2xl' : '40px',
      }}
    >
      <Avatar size={size} name={profile.name} path={profile.avatar} />
      <Box
        css={{
          position: 'absolute',
          bottom: -8,
          right: 0,
          zIndex: 9,
        }}
      >
        <Flex
          css={{
            borderRadius: '$3',
            alignItems: 'center',
            justifyContent: 'center',
            background: '$cta',
            color: '$textOnCta',
            p: '2px $xs',
          }}
        >
          <Flex css={{ alignItems: 'center', gap: '2px' }}>
            <Text semibold size={'xs'}>
              {profile.links ?? 0}
            </Text>{' '}
            {/*<Link size={'xs'} />*/}
            <Award size={'xs'} />
            {/*<Users size={'xs'} />*/}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
