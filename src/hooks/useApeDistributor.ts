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

  const claim = (
    circle: BytesLike,
    token: string,
    epoch: BigNumberish,
    index: BigNumberish,
    account: string,
    checkpoint: BigNumberish,
    redeemShares: boolean,
    proof: BytesLike[]
  ) =>
    rundistributorTx(v =>
      v.claim(
        circle,
        token,
        epoch,
        index,
        account,
        checkpoint,
        redeemShares,
        proof
      )
    );

  const claimMany = (
    circles: BytesLike[],
    tokens: string[],
    accounts: string[],
    epochs: BigNumberish[],
    indexes: BigNumberish[],
    checkpoints: BigNumberish[],
    redeemShares: boolean[],
    proofs: BytesLike[][]
  ) => {
    if (
      ![
        circles.length,
        tokens.length,
        accounts.length,
        epochs.length,
        indexes.length,
        checkpoints.length,
        proofs.length,
      ].every(v => v === circles.length)
    ) {
      throw new Error('All arrays must have same length');
    }
    return rundistributorTx(v =>
      v.claimMany(
        circles,
        [...tokens, ...accounts],
        [...epochs, ...indexes, ...checkpoints],
        redeemShares,
        proofs
      )
    );
  };

  const isClaimed = (
    circle: BytesLike,
    token: string,
    epoch: BigNumberish,
    index: BigNumberish
  ) => rundistributorTx(v => v.isClaimed(circle, token, epoch, index));

  return { uploadEpochRoot, claim, claimMany, isClaimed };
}
