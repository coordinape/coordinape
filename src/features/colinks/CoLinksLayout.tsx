import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { scrollToTop } from '../../components';
import { GlobalUi } from 'components/GlobalUi';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Box, Flex } from 'ui';

import { CoLinksNav } from './CoLinksNav';

export const CoLinksLayout = ({ children }: { children: React.ReactNode }) => {
  // Scroll to top on every location change
  const location = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [location]);

  return (
    <Box
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
        <CoLinksNav />
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          {/*<HelpButton />*/}
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
              '@sm': {
                zIndex: 1,
                pt: '$3xl',
              }, // for hamburger menu
            }}
          >
            <EmailBanner />
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
