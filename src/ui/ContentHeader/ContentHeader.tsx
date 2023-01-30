import { Flex } from 'ui';

const ContentHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex
      column
      css={{
        gap: '$sm',
        position: sticky ? 'sticky' : undefined,
        top: sticky ? '0' : undefined,
        zIndex: 2,
        background: '$background',
        borderBottom: '1px solid $contentHeaderBorder',
        // compensate for default page top and left padding:
        p: '$lg 0 $lg $xl',
        m: '-$lg 0 $lg -$xl',
        '@sm': {
          position: 'static',
          zIndex: 'auto',
          mr: '-$xl',
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
    </Flex>
  );
};

export default ContentHeader;
