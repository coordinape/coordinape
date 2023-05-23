import { useEffect, useState } from 'react';

import { BigNumber } from 'ethers';

import { useToast } from '../../hooks';

import { Contracts } from './contracts';

export const useCoSoulToken = ({
  contracts,
  account,
}: {
  contracts: Contracts;
  account: string;
}) => {
  const { showError } = useToast();
  const [tokenId, setTokenId] = useState<number | null>(null);

  const refresh = () => {
    contracts.cosoul.balanceOf(account).then((balance: BigNumber) => {
      if (balance.toNumber() === 0) {
        setTokenId(0);
        return;
      }
      contracts.cosoul
        .tokenOfOwnerByIndex(account, 0)
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
