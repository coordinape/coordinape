import { CSS } from '@stitches/react';

import { Flex } from 'ui';

const ContentHeader = ({
  children,
  sticky,
  transparent,
  css,
}: {
  children: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  css?: CSS;
}) => {
  return (
    <Flex
      column
      className="contentHeader"
      css={{
        gap: '$sm',
        position: sticky ? 'sticky' : undefined,
        top: sticky ? '0' : undefined,
        zIndex: 2,
        background: transparent ? 'transparent' : '$background',
        borderBottom: '1px solid $contentHeaderBorder',
        // compensate for default page top and left padding:
        p: '$lg 0 $lg $xl',
        m: '-$lg 0 $lg -$xl',
        '@sm': {
          position: 'static',
          zIndex: 'auto',
        },
        ...css,
      }}
    >
      <Flex
        css={{
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '$md',
          '& p': {
            maxWidth: '$readable',
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
