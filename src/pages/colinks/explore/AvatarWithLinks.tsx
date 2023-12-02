import { Users } from '../../../icons/__generated';
import { Avatar, Box, Flex, Text } from '../../../ui';

export const AvatarWithLinks = ({
  profile,
}: {
  profile: { name?: string; avatar?: string; links?: number };
}) => {
  return (
    <Box
      css={{
        position: 'relative',
        width: '$2xl',
        height: '$2xl',
      }}
    >
      <Avatar size={'large'} name={profile.name} path={profile.avatar} />
      <Box
        css={{
          // width: 28,
          // height: 28,
          position: 'absolute',
          bottom: -8,
          right: 0,
          zIndex: 9,
        }}
      >
        <Flex
          css={{
            // width: 28,
            // height: 28,
            borderRadius: '$3',
            alignItems: 'center',
            justifyContent: 'center',
            background: '$primary',
            color: '$textOnPrimary',
            p: '2px $xs',
          }}
        >
          <Flex css={{ alignItems: 'center', gap: '2px' }}>
            <Text semibold size={'xs'}>
              {profile.links ?? 0}
            </Text>{' '}
            {/*<Link size={'xs'} />*/}
            {/*<Link2 size={'xs'} />*/}
            <Users size={'xs'} />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
