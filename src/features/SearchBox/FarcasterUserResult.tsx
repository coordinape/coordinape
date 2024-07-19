import { Avatar, Flex, Text } from '../../ui';

export const FarcasterUserResult = ({
  user,
}: {
  user: {
    address?: string;
    fname?: string;
    avatar_url?: string;
    display_name?: string;
  };
}) => {
  return (
    <Flex
      css={{
        width: '100%',
        alignItems: 'center',
        gap: '$md',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        css={{
          alignItems: 'center',
          gap: '$md',
        }}
      >
        <Avatar size="small" name={user.fname} path={user.avatar_url} />
        <Text semibold>{user.fname}</Text>
      </Flex>
    </Flex>
  );
};
