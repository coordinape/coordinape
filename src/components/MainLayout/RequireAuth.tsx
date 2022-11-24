import { ReactElement, useEffect } from 'react';

import { useFinishAuth } from 'features/auth/useFinishAuth';
import { useWalletAuth } from 'features/auth/useWalletAuth';

import { LoadingModal, WalletAuthModal } from 'components';
import { useAuthStep } from 'hooks/login';
import { useWeb3React } from 'hooks/useWeb3React';

export const RequireAuth = (props: { children: ReactElement }) => {
  const { address, authTokens } = useWalletAuth();
  const web3Context = useWeb3React();
  const finishAuth = useFinishAuth();
  const [authStep, setAuthStep] = useAuthStep();

  useEffect(() => {
    // reset after logging out or signature error
    if (authStep !== 'connect' && !web3Context.active) {
      setAuthStep('connect');
      return;
    }

    if (authStep === 'connect' && web3Context.active) {
      setAuthStep('sign');
      finishAuth({ web3Context, authTokens }).then(success => {
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
  // TODO: create a new component that allows the user to choose either
  // WalletAuthModal or email login

  // step 2: reuse an auth token, or get a new one with a signature
  if (authStep !== 'done') return <LoadingModal visible note="RequireAuth" />;

  // step 3: render routes
  return props.children;
};
