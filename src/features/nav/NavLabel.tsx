import { ReactNode } from 'react';

import { Flex, Text } from '../../ui';

export const NavLabel = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Flex
      onClick={onClick}
      css={{
        my: '$md',
        cursor: onClick ? 'pointer' : 'inherit',
        '&:hover svg': { color: '$cta' },
        '@lg': {
          my: '$sm',
        },
        justifyContent: 'space-between',
      }}
    >
      <Text variant="label" css={{ color: '$neutral' }}>
        {label}
      </Text>
      {icon && icon}
    </Flex>
  );
};
