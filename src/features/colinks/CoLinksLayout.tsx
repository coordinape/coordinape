import React, { useContext, useEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { scrollToTop } from '../../components';
import { GlobalUi } from 'components/GlobalUi';
import HelpButton from 'components/HelpButton';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Box, Flex, Text } from 'ui';

import { CoLinksContext } from './CoLinksContext';
import { CoLinksNav } from './CoLinksNav';

export const CoLinksLayout = ({
  children,
  suppressNav = false,
}: {
  children: React.ReactNode;
  suppressNav?: boolean;
}) => {
  // Scroll to top on every location change
  const location = useLocation();

  useEffect(() => {
    scrollToTop();
  }, [location]);

  const { coLinksReadOnly } = useContext(CoLinksContext);

  // if (library === undefined || onCorrectChain === undefined) {
  //   return <LoadingIndicator />;
  // }

  if (!coLinksReadOnly) {
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
        {!suppressNav && <CoLinksNav />}
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          <HelpButton css={{ '@sm': { display: 'none' } }} />
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
              '@sm': {
                zIndex: 1,
                ...(!suppressNav && {
                  // for hamburger menu
                  pt: '$3xl',
                  // for mobile browser bottom clipping
                  pb: '$4xl',
                }),
              },
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
