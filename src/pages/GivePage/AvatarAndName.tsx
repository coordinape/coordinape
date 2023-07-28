import { Avatar, Flex, Text } from 'ui';

// AvatarAndName renders the avatar and a member name for inclusion in a GiveRow
export const AvatarAndName = ({
  name,
  avatar,
  hasCoSoul,
}: {
  name: string;
  avatar?: string;
  hasCoSoul: boolean;
}) => {
  return (
    <Flex
      alignItems="center"
      css={{
        flexGrow: 0,
        minWidth: 0,
      }}
    >
      <Avatar
        size="small"
        name={name}
        path={avatar}
        hasCoSoul={hasCoSoul}
        css={{ mr: '$sm' }}
      />
      <Text ellipsis>
        {name === 'Coordinape' && 'Donate to '}
        {name}
      </Text>
    </Flex>
  );
};
