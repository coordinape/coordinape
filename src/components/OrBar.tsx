import { CSS } from '@stitches/react';

import { Flex, HR, Text } from '../ui';

export const OrBar = ({
  children,
  css,
}: {
  children: React.ReactNode;
  css?: CSS;
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
      <HR css={{ flexShrink: 2 }} />
      <Text
        size="xs"
        color="neutral"
        css={{ flexShrink: 1, whiteSpace: 'nowrap' }}
      >
        {children}
      </Text>
      <HR css={{ flexShrink: 2 }} />
    </Flex>
  );
};
