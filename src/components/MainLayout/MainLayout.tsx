import { Suspense } from 'react';

import HelpButton from '../HelpButton';
import { GlobalUi, SentryScopeController } from 'components';
import { AppRoutes } from 'routes/routes';
import { Box } from 'ui';

import { MainHeader } from './MainHeader';
import { RequireAuth } from './RequireAuth';

// this component sets up the top navigation bar to stay fixed on-screen and
// have content scroll underneath it

export const MainLayout = () => {
  return (
    <Box
      css={{
        position: 'fixed',
        background: '$background',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        '& > main': { flex: 1 },
      }}
    >
      <MainHeader />
      <RequireAuth>
        <Suspense fallback={null}>
          <Box
            as="main"
            css={{
              overflowY: 'auto',
              '@sm': { zIndex: 1 }, // for hamburger menu
            }}
          >
            <GlobalUi />
            <SentryScopeController />
            <AppRoutes />
          </Box>
          <HelpButton />
        </Suspense>
      </RequireAuth>
    </Box>
  );
};

export default MainLayout;

// this is in this file because it depends on the <main> tag defined above
export const scrollToTop = () => {
  document.getElementsByTagName('main')[0].scrollTop = 0;
};
