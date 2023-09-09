import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { paths } from '../../routes/paths';
import { Avatar, Flex, Text } from '../../ui';

export const CircleLogoWithName = ({
  circle,
  variant = 'default',
  reverse = false,
  css,
}: {
  circle: { id: number; name: string; logo?: string };
  variant?: 'default' | 'heading';
  reverse?: boolean;
  css?: CSS;
}) => {
  return (
    <Flex
      as={NavLink}
      to={paths.circle(circle.id)}
      css={{
        textDecoration: 'none',
        gap: '$sm',
        flexDirection: reverse ? 'row-reverse' : 'row',
        ...css,
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
