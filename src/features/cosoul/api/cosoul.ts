import { BigNumber } from 'ethers';

import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../chains';
import { Contracts } from '../contracts';

const PGIVE_SLOT = 0;

function getCoSoulContract() {
  // this is the preferred optimism chain id
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  return contracts.cosoul;
}

// get the cosoul token id for a given address
export const getTokenId = async (address: string) => {
  const contract = getCoSoulContract();

  // see if they have any CoSoul tokens
  const balanceOfBN = await contract.balanceOf(address);
  const balanceOf = balanceOfBN.toNumber();

  // if they don't have a balance there is nothing more to do
  if (balanceOf === 0) {
    return undefined;
  }

  // fetch their first token because they can only have one per the contract
  return await contract.tokenOfOwnerByIndex(address, BigNumber.from(0));
};

// get the on-chain PGIVE balance for a given token
export const getOnChainPGIVE = async (tokenId: number) => {
  const contract = getCoSoulContract();
  return await contract.getSlot(PGIVE_SLOT, tokenId);
};

// set the on-chain PGIVE balance for a given token
export const setOnChainPGIVE = async (tokenId: number, amount: number) => {
  const contract = getCoSoulContract();
  const signedContract = contract.connect(getAuthorizedSyncSigner());

  return await signedContract.setSlot(PGIVE_SLOT, tokenId, amount);
};

// get the signer that is authorized to sync the on-chain PGIVE balance
const getAuthorizedSyncSigner = () => {
  return 'FILL THIS IN SINGER';
};
