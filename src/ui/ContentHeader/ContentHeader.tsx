import { Flex, HR } from 'ui';

const ContentHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        hr: {
          background: '$contentHeaderBorder',
        },
      }}
    >
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '$md',
          '& p': {
            maxWidth: '50em',
          },
          '@sm': {
            flexDirection: 'column',
          },
        }}
      >
        {children}
      </Flex>
      <HR flush />
    </Flex>
  );
};

export default ContentHeader;
