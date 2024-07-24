import React, { useEffect } from 'react';

import { CSS } from 'stitches.config';

import { Flex } from 'ui';

export const PartyBody = ({
  children,
  css,
  wrapperCss,
}: {
  children: React.ReactNode;
  css?: CSS;
  wrapperCss?: CSS;
}) => {
  useEffect(() => {
    // Change safari header bar color
    const metaThemeColor = document.querySelector(
      'meta[name="theme-color"]'
    ) as HTMLMetaElement;
    metaThemeColor.content = '#5507E7';
    // Revert to original value on unmount
    return () => {
      if (metaThemeColor) {
        metaThemeColor.content = '#000000';
      }
    };
  }, []);
  return (
    <Flex
      column
      css={{
        height: '100vh',
        width: '100%',
        borderTop: '1px solid #4906C7',
        background:
          'radial-gradient(circle at 25% 0%, #5507E7 20%, #E7A607 100%)',
        alignItems: 'center',
        position: 'fixed',
        overflow: 'scroll',
        paddingBottom: 100,
        '*': {
          color: 'white',
          path: { fill: 'white' },
        },
        ...wrapperCss,
      }}
    >
      <Flex
        css={{
          position: 'relative',
          width: '80%',
          margin: '0px auto',
          gap: '$xl',
          flexFlow: 'column nowrap',
          '@md': {
            width: '96%',
          },
          ...css,
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
