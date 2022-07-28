import { ReactElement, Suspense, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { LinearProgress } from '@material-ui/core';

import HelpButton from '../HelpButton';
import {
  GlobalUi,
  LoadingModal,
  SentryScopeController,
  WalletAuthModal,
} from 'components';
import { useApiBase } from 'hooks';
import { AuthContext, useAuthStep } from 'hooks/login';
import type { AuthStep } from 'hooks/login';
import { useWalletAuth } from 'recoilState';
import { AppRoutes } from 'routes/routes';
import { Box } from 'ui';

import { MainHeader } from './MainHeader';

// this component sets up the top navigation bar to stay fixed on-screen and
// have content scroll underneath it

export const MainLayout = () => {
  const authStepState = useState<AuthStep>('connect');

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
      <AuthContext.Provider value={authStepState}>
        <MainHeader />
        <RequireAuth>
          <Suspense fallback={<LinearProgress />}>
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
      </AuthContext.Provider>
    </Box>
  );
};

export default MainLayout;

// this is in this file because it depends on the <main> tag defined above
export const scrollToTop = () => {
  document.getElementsByTagName('main')[0].scrollTop = 0;
};

const RequireAuth = (props: { children: ReactElement }) => {
  const address = useWalletAuth().address;
  const web3Context = useWeb3React();
  const { finishAuth } = useApiBase();
  const [authStep, setAuthStep] = useAuthStep();

  useEffect(() => {
    // reset after logging out or signature error
    if (authStep !== 'connect' && !web3Context.active) {
      setAuthStep('connect');
      return;
    }

    if (authStep === 'connect' && web3Context.active) {
      setAuthStep('sign');
      finishAuth({ web3Context }).then(success => {
        if (!success) {
          web3Context.deactivate();
        } else {
          setAuthStep('done');
        }
      });
    }
  }, [address, web3Context]);

  // step 1: get a wallet connection
  if (authStep === 'connect') return <WalletAuthModal open />;

  // step 2: reuse an auth token, or get a new one with a signature
  if (authStep !== 'done') return <LoadingModal visible note="RequireAuth" />;

  // step 3: render routes
  return props.children;
};
