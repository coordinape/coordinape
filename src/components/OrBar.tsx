import { CSS } from '@stitches/react';

import { Flex, HR, Text } from '../ui';

export const OrBar = ({
  children,
  css,
  color,
}: {
  children: React.ReactNode;
  css?: CSS;
  color?: string;
}) => {
  return (
    <Flex
      css={{
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '$md',
        flexWrap: 'nowrap',
        width: '100%',
        ...css,
      }}
    >
      <HR css={{ flexShrink: 2, background: color }} />
      <Text
        size="xs"
        color="neutral"
        css={{ flexShrink: 1, whiteSpace: 'nowrap', color: color }}
      >
        {children}
      </Text>
      <HR css={{ flexShrink: 2, background: color }} />
    </Flex>
  );
};
