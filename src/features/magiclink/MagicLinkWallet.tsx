import { useEffect, useState } from 'react';

import { KEY_MAGIC_NETWORK, getMagic, getOptMagic } from '../auth/magic';
import { NavItem } from '../nav/NavItem';

export const MagicLinkWallet = () => {
  const [hasMagic, setHasMagic] = useState(false);
  const magicNetwork = window.localStorage.getItem(KEY_MAGIC_NETWORK);

  useEffect(() => {
    // if magic has been loaded, we should show the button
    if ((window as any).magic || (window as any).optMagic) {
      setHasMagic(true);
    }
  }, [magicNetwork]);

  const showWallet = async () => {
    let magic;
    if (magicNetwork === 'optimism') {
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
