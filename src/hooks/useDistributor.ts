import { ApeDistributor } from '@coordinape/hardhat/dist/typechain';
import { ContractTransaction, BigNumberish, BytesLike } from 'ethers';

import { Contracts } from 'services/contracts';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useApeSnackbar } from './useApeSnackbar';
import { useContracts } from './useContracts';

type Helpers = {
  contracts: Contracts | undefined;
  showError: (error: any) => void;
  showInfo: (info: any) => void;
};

// TODO: pass the contract to be used ("ApeDistributor" below) as an argument,
// so that these helpers can be reused for all contracts. Not sure how to
// handle the typing for that.
const makeWrappers = ({ contracts, showError, showInfo }: Helpers) => {
  const sendTx = async (
    callback: (apeDistributor: ApeDistributor) => Promise<ContractTransaction>
  ) => {
    if (!contracts) return showError('Contracts not loaded');

    return sendAndTrackTx(() => callback(contracts.distributor), {
      showInfo,
      showError,
    });
  };

  const call = async (
    callback: (apeDistributor: ApeDistributor) => Promise<any>
  ) => {
    if (!contracts) return showError('Contracts not loaded');

    try {
      return callback(contracts.distributor);
    } catch (e) {
      showError(e);
    }
  };

  return { sendTx, call };
};

export function useDistributor() {
  const contracts = useContracts();
  const { showInfo, showError } = useApeSnackbar();
  const { sendTx, call } = makeWrappers({ contracts, showInfo, showError });

  const uploadEpochRoot = async (
    vault: string,
    circle: BytesLike,
    token: string,
    root: BytesLike,
    amount: BigNumberish,
    tapType: BigNumberish
  ) =>
    sendTx(d => d.uploadEpochRoot(vault, circle, token, root, amount, tapType));

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
    sendTx(d =>
      d.claim(
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
  ) =>
    sendTx(d => {
      if (
        [tokens, accounts, epochs, indexes, checkpoints, proofs].some(
          v => v.length !== circles.length
        )
      ) {
        throw new Error('All arrays must have same length');
      }
      return d.claimMany(
        circles,
        [...tokens, ...accounts],
        [...epochs, ...indexes, ...checkpoints],
        redeemShares,
        proofs
      );
    });

  const isClaimed = (
    circle: BytesLike,
    token: string,
    epoch: BigNumberish,
    index: BigNumberish
  ) => call(d => d.isClaimed(circle, token, epoch, index)) as Promise<boolean>;

  const getEpochRoot = (
    _circleId: BytesLike,
    _token: string,
    _epoch: BigNumberish
  ) => call(d => d.epochRoots(_circleId, _token, _epoch)) as Promise<string>;

  return { uploadEpochRoot, claim, claimMany, isClaimed, getEpochRoot };
}
