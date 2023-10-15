import { Flex } from '../../ui';

export const SoulKeysNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex css={{ justifyContent: 'center' }}>
      <Flex column css={{ maxWidth: '$readable' }}>
        {children}
      </Flex>
    </Flex>
  );
};
