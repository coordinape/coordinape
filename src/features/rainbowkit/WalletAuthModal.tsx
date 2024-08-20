import { ReactNode } from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useReloadCookieAuth } from 'hooks/useReloadCookieAuth';

export const WalletAuthModal = ({ children }: { children: ReactNode }) => {
  const { profileId } = useReloadCookieAuth();

  if (!profileId) {
    return <ConnectButton />;
  }

  return <>{children}</>;
};
