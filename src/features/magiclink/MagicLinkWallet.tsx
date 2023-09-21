/* eslint-disable no-console */

import { useEffect, useState } from 'react';

import { getMagic } from '../auth/magic';
import { NavItem } from '../nav/NavItem';

export const MagicLinkWallet = () => {
  const [hasMagic, setHasMagic] = useState(false);

  useEffect(() => {
    // if magic has been loaded, we should show the button
    if ((window as any).magic) {
      setHasMagic(true);
    }
  });

  const showWallet = async () => {
    const magic = getMagic();
    await magic.wallet.showUI();
  };

  if (!hasMagic) {
    return null;
  }
  return <NavItem onClick={showWallet} label="Show Wallet" />;
};
