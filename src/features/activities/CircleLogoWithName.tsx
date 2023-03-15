import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Flex, Text } from '../../ui';

export const CircleLogoWithName = ({
  circle,
  variant = 'default',
}: {
  circle: { id: number; name: string; logo?: string };
  variant?: 'default' | 'heading';
}) => {
  return (
    <Flex
      as={NavLink}
      to={paths.history(circle.id)}
      css={{ textDecoration: 'none' }}
    >
      <Avatar
        size="xs"
        css={{ flexShrink: 0 }}
        name={circle.name}
        path={circle.logo}
      />
      <Text
        color={variant === 'default' ? 'neutral' : 'heading'}
        size={variant === 'default' ? 'small' : undefined}
        semibold={variant === 'default' ? undefined : true}
        css={{ ml: '$sm', textDecoration: 'none' }}
      >
        {circle.name}
      </Text>
    </Flex>
  );
};
