import React, { useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { scrollToTop } from '../../components';
import { LoadingIndicator } from '../../components/LoadingIndicator';
import { GlobalUi } from 'components/GlobalUi';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Box, Flex, Text } from 'ui';

import { CoLinksContext } from './CoLinksContext';
import { CoLinksNav } from './CoLinksNav';

export const CoLinksLayout = ({ children }: { children: React.ReactNode }) => {
  // Scroll to top on every location change
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location]);

  const { library, onCorrectChain, coLinks } = useContext(CoLinksContext);

  if (library === undefined || onCorrectChain === undefined) {
    return <LoadingIndicator />;
  }

  if (!coLinks) {
    return <Text>CoLinks not available.</Text>;
  }

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
