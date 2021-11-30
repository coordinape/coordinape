import React, { useEffect } from 'react';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import { useApiBase, useDeepChangeEffect } from 'hooks';
import { useWalletAuth } from 'recoilState/app';
import { getApiService } from 'services/api';

export const WalletController = () => {
  const web3Context = useWeb3React<Web3Provider>();

  const { fetchManifest, updateAuth, logout, navigateDefault } = useApiBase();
  const { address, authTokens } = useWalletAuth();
  const authToken = address && authTokens?.[address];

  useDeepChangeEffect(() => {
    if (authToken) {
      fetchManifest()
        .then(navigateDefault)
        .catch(() => {
          web3Context.deactivate();
          logout();
        });
    }
  }, [authToken]);

  useEffect(() => {
    getApiService().setProvider(web3Context.library);
    if (
      web3Context.account &&
      ((address && web3Context.account !== address) || !address)
    ) {
      updateAuth({
        address: web3Context.account,
        web3Context: web3Context,
      });
    }
  }, [web3Context, address]);

  return <></>;
};
