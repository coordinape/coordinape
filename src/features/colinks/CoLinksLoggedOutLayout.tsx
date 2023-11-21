import React from 'react';

import { SingleColumnLayout } from '../../ui/layouts';
import { NavLogo } from '../nav/NavLogo';
import { GlobalUi } from 'components/GlobalUi';
import HelpButton from 'components/HelpButton';
import { Box, Flex } from 'ui';

export const CoLinksLoggedOutLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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
        <Box css={{ width: '100%' }}>
          <GlobalUi />
          <HelpButton />
          <Box
            as="main"
            css={{
              height: '100vh',
              overflowY: 'auto',
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
                <NavLogo />
              </Flex>
            </SingleColumnLayout>
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};
