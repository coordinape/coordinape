import assert from 'assert';
import { useEffect, useState } from 'react';

import { Address } from 'viem';

import { useToast } from '../../hooks';
import { getCoSoulContract } from 'utils/viem/contracts';

export const useCoSoulToken = ({
  address,
}: {
  address: string | null | undefined;
}) => {
  const { showError } = useToast();
  const [tokenId, setTokenId] = useState<number | null>(null);

  const contract = getCoSoulContract();

  const refresh = () => {
    assert(contract);
    assert(address);
    contract.read.balanceOf([address as Address] as const).then(balance => {
      if (balance === 0n) {
        setTokenId(0);
        return;
      }
      contract.read
        .tokenOfOwnerByIndex([address as Address, 0n] as const)
        .then(tokenId => {
          setTokenId(Number(tokenId));
        })
        .catch((e: any) => {
          showError('Error Checking Existing CoSoul: ' + e.message);
        });
    });
  };

  useEffect(() => {
    if (contract && address) {
      refresh();
    }
  }, [contract, address]);

  return { tokenId, refresh };
};
