import { useEffect, useState } from 'react';

import { knownTokens } from 'config/networks';

import { useContracts } from './useContracts';

export function useGetAnyTokenValue(tokenAddress: string) {
  const [balance, setBalance] = useState<any>(0);
  const contracts = useContracts();

  const getTokenBalance = async (tokenAddress: string) => {
    if (!contracts) return;
    // Check if address is either a zero address or a weth address
    const isEth = Object.values(knownTokens.WETH.addresses)
      .map(a => a.toLowerCase())
      .includes(tokenAddress.toLowerCase());
    if (isEth) {
      setBalance(await contracts.getETHBalance());
    } else {
      const token = contracts.getERC20(tokenAddress);
      const address = await contracts.getMyAddress();
      if (address) setBalance(await token.balanceOf(address));
    }
  };

  useEffect(() => {
    getTokenBalance(tokenAddress);
  }, [tokenAddress, contracts]);

  return { getTokenBalance, balance };
}
