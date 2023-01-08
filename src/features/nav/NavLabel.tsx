import { ReactNode } from 'react';

import { Flex, Text } from '../../ui';

export const NavLabel = ({
  label,
  icon,
}: {
  label: string;
  icon?: ReactNode;
}) => {
  return (
    <Flex
      css={{
        marginTop: '$xl',
        marginBottom: '$md',
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
