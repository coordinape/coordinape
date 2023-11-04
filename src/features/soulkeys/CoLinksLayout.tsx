import React from 'react';

import { GlobalUi } from 'components/GlobalUi';
import { EmailBanner } from 'pages/ProfilePage/EmailSettings/EmailBanner';
import { Box, Flex } from 'ui';

import { SoulKeyNav } from './SoulKeyNav';

export const CoLinksLayout = ({ children }: { children: React.ReactNode }) => {
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
        <SoulKeyNav />
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
