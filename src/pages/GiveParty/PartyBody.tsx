import React, { useEffect } from 'react';

import { Flex } from 'ui';

export const PartyBody = ({ children }: { children: React.ReactNode }) => {
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
        '@sm': {
          fontSize: '$xs',
        },
        '*': {
          color: 'white',
        },
      }}
    >
      <Flex
        css={{
          position: 'relative',
          width: '80%',
          margin: 'auto',
          gap: '$2xl',
          flexFlow: 'column nowrap',
          '@md': {
            width: '96%',
          },
        }}
      >
        {children}
      </Flex>
    </Flex>
  );
};
