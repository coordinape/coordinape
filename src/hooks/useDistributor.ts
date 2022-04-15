import assert from 'assert';

import { ContractTransaction, BigNumberish, BytesLike } from 'ethers';
import type { ApeDistributor, Contracts } from 'lib/vaults';

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

  const call = async <T>(
    callback: (apeDistributor: ApeDistributor) => Promise<T>
  ) => {
    assert(contracts, 'Contracts not loaded');
    return callback(contracts.distributor);
  };

  return { sendTx, call };
};

type ClaimProps = {
  vault: string;
  circle: BytesLike;
  token: string;
  epoch: BigNumberish;
  index: BigNumberish;
  account: string;
  checkpoint: BigNumberish;
  redeemShare: boolean;
  proof: BytesLike[];
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

  const claim = (props: ClaimProps) =>
    sendTx(d =>
      d.claim(
        props.vault,
        props.circle,
        props.token,
        props.epoch,
        props.index,
        props.account,
        props.checkpoint,
        props.redeemShare,
        props.proof
      )
    );

  const claimMany = (claims: ClaimProps[]) => sendTx(d => d.claimMany(claims));

  const isClaimed = (
    vault: string,
    circle: BytesLike,
    token: string,
    epoch: BigNumberish,
    index: BigNumberish
  ) => call<boolean>(d => d.isClaimed(vault, circle, token, epoch, index));

  const getEpochRoot = (
    vault: string,
    circle: BytesLike,
    token: string,
    epoch: BigNumberish
  ) => call<string>(d => d.epochRoots(vault, circle, token, epoch));

  return { uploadEpochRoot, claim, claimMany, isClaimed, getEpochRoot };
}
