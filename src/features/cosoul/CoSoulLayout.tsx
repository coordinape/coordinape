import React, { useEffect } from 'react';

import { NavLogo } from 'features/nav/NavLogo';
import { dark } from 'stitches.config';

import { scrollToTop } from 'components';
import { GlobalUi } from 'components/GlobalUi';
import HelpButton from 'components/HelpButton';
import { Box, Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { CoSoulNav } from '.';

const CoSoulLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    scrollToTop();
  });

  return (
    <Box
      className={dark}
      css={{
        background: '$background',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        '& > main': { flex: 1, flexGrow: 1 },
      }}
    >
      <Flex css={{ height: 'auto' }}>
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          <HelpButton />
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
              // '@sm': {
              //   zIndex: 1,
              //   pt: '$3xl',
              // }, // for hamburger menu
            }}
          >
            <SingleColumnLayout
              css={{
                m: 'auto',
                zIndex: 1,
                position: 'relative',
              }}
            >
              <Flex
                row
                css={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '$md',
                }}
              >
                <NavLogo forceTheme="dark" />
                <CoSoulNav />
              </Flex>
            </SingleColumnLayout>
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default CoSoulLayout;
