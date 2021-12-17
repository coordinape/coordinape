import { useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import { knownTokens } from 'config/networks';
import { ERC20Service } from 'services/erc20';

export function useGetAnyTokenValue(tokenAddress: string) {
  const [balance, setBalance] = useState<number>(0);
  const web3Context = useWeb3React();
  const { library, account } = web3Context;

  useEffect(() => {
    getTokenBalance(tokenAddress);
  }, [tokenAddress]);

  const getTokenBalance = async (tokenAddress: string) => {
    // Check if address is either a zero address or a weth address
    const isEth =
      tokenAddress === knownTokens.ETH.addresses[1] ||
      tokenAddress === knownTokens.ETH.addresses[4] ||
      tokenAddress === knownTokens.ETH.addresses[1337];
    if (isEth) {
      library
        .getBalance(account)
        .then((bal: any) =>
          setBalance(parseInt(ethers.utils.formatEther(bal)))
        );
    } else {
      const signer = await web3Context.library.getSigner();
      const token = new ERC20Service(
        await web3Context.library,
        await signer.getAddress(),
        tokenAddress
      );
      const bal = await token.getBalanceOf(account ? account : '');
      setBalance(parseInt(ethers.utils.formatEther(bal)));
    }
  };
  return { getTokenBalance, balance };
}
