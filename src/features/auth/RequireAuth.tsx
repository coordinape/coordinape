import { ReactNode, useEffect } from 'react';

import { getMagic, getMagicProvider } from 'features/auth/magic';

import { LoadingModal } from 'components';
import { useToast } from 'hooks';
import { useWeb3React } from 'hooks/useWeb3React';

import { connectors } from './connectors';
import { useAuthStore } from './store';
import { useFinishAuth } from './useFinishAuth';
import { useSavedAuth } from './useSavedAuth';
import { WalletAuthModal } from './WalletAuthModal';

// call this hook with showErrors = false if you want to re-establish an
// existing login session where possible, and fail silently
export const useAuthStateMachine = (showErrors: boolean) => {
  const { address, authTokens, connectorName } = useSavedAuth();
  const web3Context = useWeb3React();
  const finishAuth = useFinishAuth();
  const authStep = useAuthStore(state => state.step);
  const setAuthStep = useAuthStore(state => state.setStep);
  const { showError } = useToast();

  useEffect(() => {
    if (['reuse', 'connect'].includes(authStep) && web3Context.active) {
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
          if (showErrors) console.error(e);
          web3Context.deactivate();
        });
    }

    // reset after logging out or signature error
    if (['sign', 'done'].includes(authStep) && !web3Context.active) {
      setAuthStep('connect');
      return;
    }

    if (authStep === 'reuse') {
      if (!connectorName) {
        setAuthStep('connect');
        return;
      }

      // success in any of the blocks below will set web3context.active = true,
      // so this useEffect hook will re-run and call setAuthStep('sign') above
      (async () => {
        if (connectorName === 'magic') {
          try {
            const info = await getMagic().connect.getWalletInfo();
            if (info?.walletType === 'magic') {
              const provider = await getMagicProvider();
              await web3Context.setProvider(provider, 'magic');
            }
          } catch (e: any) {
            setAuthStep('connect');
            // this error is expected when the user isn't logged in
            if (e?.message.match(/User denied account access/)) return;

            if (showErrors) showError(e);
            web3Context.deactivate();
          }
          return;
        }

        try {
          await web3Context.activate(connectors[connectorName], () => {}, true);
        } catch (e) {
          setAuthStep('connect');
          if (showErrors) showError(e);
          web3Context.deactivate();
        }
      })();
    }
  }, [address, web3Context]);
};

export const RequireAuth = (props: { children: ReactNode }) => {
  useAuthStateMachine(true);
  const authStep = useAuthStore(state => state.step);
  const web3Context = useWeb3React();

  // get a new wallet connection
  if (authStep === 'connect' && !web3Context.active) return <WalletAuthModal />;

  // reuse a connection or request a signature
  if (authStep !== 'done')
    return <LoadingModal visible note={`RequireAuth-${authStep}`} />;

  // render routes
  return <>{props.children}</>;
};
