import { Suspense } from 'react';

import { RequireAuth } from 'features/auth';

import HelpButton from '../HelpButton';
import { GlobalUi } from 'components/GlobalUi';
import { AppRoutes } from 'routes/routes';
import { Box } from 'ui';

import { MainHeader } from './MainHeader';

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
      <GlobalUi />
      <HelpButton />
      <Box
        as="main"
        css={{
          overflowY: 'auto',
          '@sm': { zIndex: 1 }, // for hamburger menu
        }}
      >
        <RequireAuth>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
        </RequireAuth>
      </Box>
    </Box>
  );
};

export default MainLayout;

// this is in this file because it depends on the <main> tag defined above
export const scrollToTop = () => {
  document.getElementsByTagName('main')[0].scrollTop = 0;
};
