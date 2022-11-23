import { ReactElement, useEffect } from 'react';

import { useWeb3React } from '@web3-react/core';

import { LoadingModal, WalletAuthModal } from 'components';
import { useApiBase } from 'hooks';
import { useAuthStep } from 'hooks/login';
import { useWalletAuth } from 'recoilState';

export const RequireAuth = (props: { children: ReactElement }) => {
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
