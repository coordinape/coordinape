import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useContracts } from './useContracts';

export function useGetAnyTokenValue(tokenAddress: string) {
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0));
  const contracts = useContracts();

  const getTokenBalance = async (tokenAddress: string) => {
    if (!contracts) return;

    const isEth =
      contracts.getToken('WETH').address.toLowerCase() ===
      tokenAddress.toLowerCase();

    if (isEth) {
      const newBalance = await contracts.getETHBalance();
      if (newBalance) setBalance(newBalance);
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
