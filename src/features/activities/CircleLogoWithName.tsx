import { NavLink } from 'react-router-dom';

import { paths } from '../../routes/paths';
import { Avatar, Flex, Text } from '../../ui';

export const CircleLogoWithName = ({
  circle,
  variant = 'default',
  reverse = false,
}: {
  circle: { id: number; name: string; logo?: string };
  variant?: 'default' | 'heading';
  reverse?: boolean;
}) => {
  return (
    <Flex
      as={NavLink}
      to={paths.circle(circle.id)}
      css={{
        textDecoration: 'none',
        gap: '$sm',
        flexDirection: reverse ? 'row-reverse' : 'row',
      }}
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
        css={{ textDecoration: 'none' }}
      >
        {circle.name}
      </Text>
    </Flex>
  );
};
