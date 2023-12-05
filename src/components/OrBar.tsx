import { Flex, HR, Text } from '../ui';

export const OrBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      css={{
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '$md',
        mt: '$sm',
        flexWrap: 'nowrap',
        width: '100%',
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
