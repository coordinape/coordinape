import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useToast } from '../../hooks';

import { Contracts } from './contracts';

export const useCoSoulToken = ({
  contracts,
  address,
}: {
  contracts: Contracts;
  address: string;
}) => {
  const { showError } = useToast();
  const [tokenId, setTokenId] = useState<number | null>(null);

  const refresh = () => {
    // eslint-disable-next-line no-console
    console.log('useCosoul hi', contracts);
    // eslint-disable-next-line no-console
    console.log('useCosoul hi', address);
    contracts.cosoul.balanceOf(address).then((balance: BigNumber) => {
      if (balance.toNumber() === 0) {
        setTokenId(0);
        return;
      }
      contracts.cosoul
        .tokenOfOwnerByIndex(address, 0)
        .then((tokenId: BigNumber) => {
          setTokenId(tokenId.toNumber());
        })
        .catch((e: any) => {
          showError('Error Checking Existing CoSoul: ' + e.message);
        });
    });
  };

  useEffect(() => {
    refresh();
  }, []);

  return { tokenId, refresh };
};
