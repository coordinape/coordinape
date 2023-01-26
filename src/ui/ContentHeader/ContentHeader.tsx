import { Flex, HR } from 'ui';

const ContentHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex column css={{ gap: '$sm' }}>
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '$md',
          '@sm': {
            flexDirection: 'column',
          },
        }}
      >
        {children}
      </Flex>
      <HR />
    </Flex>
  );
};

export default ContentHeader;
