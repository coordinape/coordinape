import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

export default function useConnectedAddress() {
  const { account, library } = useWeb3React();

  // fallback for certain providers that don't set account directly
  const [signerAddress, setSignerAddress] = useState();
  useEffect(() => {
    if (account) return;
    library?.getSigner().getAddress().then(setSignerAddress);
  }, [library]);

  return account || signerAddress || undefined;
}
