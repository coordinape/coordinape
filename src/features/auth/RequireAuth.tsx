import { ReactElement, useEffect } from 'react';

import { LoadingModal } from 'components';
import { useApeSnackbar } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';

import { connectors } from './connectors';
import { useAuthStep } from './useAuthStep';
import { useFinishAuth } from './useFinishAuth';
import { useWalletAuth } from './useWalletAuth';
import { WalletAuthModal } from './WalletAuthModal';

export const RequireAuth = (props: { children: ReactElement }) => {
  const { address, authTokens, connectorName } = useWalletAuth();
  const web3Context = useWeb3React();
  const finishAuth = useFinishAuth();
  const [authStep, setAuthStep] = useAuthStep();
  const { showError } = useApeSnackbar();

  useEffect(() => {
    // reset after logging out or signature error
    if (authStep !== 'connect' && !web3Context.active) {
      setAuthStep('connect');
      return;
    }

    if (authStep === 'connect' && web3Context.active) {
      setAuthStep('sign');
      finishAuth({ web3Context, authTokens })
        .then(success => {
          if (success) {
            setAuthStep('done');
          } else {
            web3Context.deactivate();
          }
        })
        .catch((e: any) => {
          console.error(e);
          web3Context.deactivate();
        });
    }
  }, [address, web3Context]);

  // reconnect to saved wallet
  useEffect(() => {
    (async () => {
      if (!connectorName || web3Context.active) return;
      try {
        await web3Context.activate(connectors[connectorName], () => {}, true);
      } catch (e) {
        showError(e);
        web3Context.deactivate();
      }
    })();
  }, []);

  // step 1: get a wallet connection
  if (authStep === 'connect' && !connectorName) return <WalletAuthModal />;
  // TODO: create a new component that allows the user to choose either
  // WalletAuthModal or email login

  // step 2: reuse an auth token, or get a new one with a signature
  if (authStep !== 'done') return <LoadingModal visible note="RequireAuth" />;

  // step 3: render routes
  return props.children;
};
