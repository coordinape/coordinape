import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { knownTokens } from 'config/networks';
import { ERC20Service } from 'services/erc20';

export function useGetAnyTokenValue(tokenAddress: string) {
  const [balance, setBalance] = useState<any>(0);
  const web3Context = useWeb3React();
  const { library, account } = web3Context;

  useEffect(() => {
    getTokenBalance(tokenAddress);
  }, [tokenAddress]);

  const getTokenBalance = async (tokenAddress: string) => {
    // Check if address is either a zero address or a weth address
    const isEth =
      tokenAddress === knownTokens.WETH.addresses[1] ||
      tokenAddress === knownTokens.WETH.addresses[4] ||
      tokenAddress === knownTokens.WETH.addresses[1337];
    if (isEth) {
      library.getBalance(account).then((_balance: any) => setBalance(_balance));
    } else {
      const signer = await web3Context.library.getSigner();
      const token = new ERC20Service(
        await web3Context.library,
        await signer.getAddress(),
        tokenAddress
      );
      setBalance(await token.getBalanceOf(account ? account : ''));
    }
  };
  return { getTokenBalance, balance };
}
