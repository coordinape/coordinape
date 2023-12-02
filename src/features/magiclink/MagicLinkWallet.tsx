import { useEffect, useState } from 'react';

import { useIsCoSoulSite } from 'features/cosoul/useIsCoSoulSite';

import { getMagic, getOptMagic } from '../auth/magic';
import { NavItem } from '../nav/NavItem';

export const MagicLinkWallet = () => {
  const [hasMagic, setHasMagic] = useState(false);
  const isCoSoulPage = useIsCoSoulSite();

  useEffect(() => {
    // if magic has been loaded, we should show the button
    if ((window as any).magic || (window as any).optMagic) {
      setHasMagic(true);
    }
  }, [isCoSoulPage]);

  const showWallet = async () => {
    let magic;
    if (isCoSoulPage) {
      magic = getOptMagic();
    } else {
      magic = getMagic();
    }
    await magic.wallet.showUI();
  };

  if (!hasMagic) {
    return null;
  }
  return <NavItem onClick={showWallet} label="Show Wallet" />;
};
