import { useWeb3React } from '@web3-react/core';
import { BigNumberish, BytesLike } from 'ethers';

import { makeDistributorTxFn } from 'utils/contractHelpers';

import { useApeSnackbar } from './useApeSnackbar';
import { useContracts } from './useContracts';

export function useApeDistributor() {
  const contracts = useContracts();
  const web3Context = useWeb3React();
  const { apeError } = useApeSnackbar();
  const rundistributorTx = makeDistributorTxFn(
    web3Context,
    contracts,
    apeError
  );

  const uploadEpochRoot = (
    vault: string,
    circle: BytesLike,
    token: string,
    root: BytesLike,
    amount: BigNumberish,
    tapType: BigNumberish
  ) =>
    rundistributorTx(v =>
      v.uploadEpochRoot(vault, circle, token, root, amount, tapType)
    );

  return { uploadEpochRoot };
}
