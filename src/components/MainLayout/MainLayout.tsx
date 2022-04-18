import React, { ReactNode, Suspense } from 'react';

import { LinearProgress } from '@material-ui/core';

import { Box } from 'ui';

import { MainHeader } from './MainHeader';

// this component sets up the top navigation bar to stay fixed on-screen and
// have content scroll underneath it
export const MainLayout = (props: { children: ReactNode }) => {
  return (
    <Box
      css={{
        position: 'fixed',
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
      <Suspense fallback={<LinearProgress />}>
        <Box
          as="main"
          css={{
            overflowY: 'auto',
            '@sm': { zIndex: 1 }, // for hamburger menu
          }}
        >
          {props.children}
        </Box>
      </Suspense>
    </Box>
  );
};

export default MainLayout;

// this is in this file because it depends on the <main> tag defined above
export const scrollToTop = () => {
  document.getElementsByTagName('main')[0].scrollTop = 0;
};
