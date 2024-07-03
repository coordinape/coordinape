import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber, ethers, Wallet } from 'ethers';

import { COSOUL_SIGNER_ADDR_PK } from '../../../../api-lib/config';
import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../chains';
import { Contracts } from '../contracts';

export const PGIVE_SLOT = 0;
export const REP_SLOT = 1;
export const PGIVE_SYNC_DURATION_DAYS = 30;

type Slot = typeof PGIVE_SLOT | typeof REP_SLOT;
type CoSoulArgs = { tokenId: number; amount: number };

function getCoSoulContract() {
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  return contracts.cosoul;
}

function getSignedCoSoulContract() {
  // this is the preferred optimism chain id
  const signerWallet = new Wallet(COSOUL_SIGNER_ADDR_PK);
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const contracts = new Contracts(chainId, provider, true);
  const signer = signerWallet.connect(provider);
  return contracts.cosoul.connect(signer);
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
  return (
    await contract.tokenOfOwnerByIndex(address, BigNumber.from(0))
  ).toNumber();
};

export const mintCoSoulForAddress = async (address: string) => {
  const contract = getSignedCoSoulContract();
  const gasSettings = chain.gasSettings;

  // eslint-disable-next-line no-console
  console.log('minting CoSoul for address: ', address);

  return await contract.mintTo(address, gasSettings);
};

export async function getMintInfoFromReceipt(receipt: TransactionReceipt) {
  const transferEventSignature = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)')
  );

  const iface = getCoSoulContract().interface;

  if (receipt.logs === undefined) {
    throw new Error('No logs found in the transaction receipt');
  }

  for (const log of receipt.logs) {
    if (log.topics[0] === transferEventSignature) {
      const {
        args: { from, to, tokenId: tokenIdBN },
      } = iface.parseLog(log);
      const tokenId = tokenIdBN.toNumber();

      return { from, to, tokenId };
    }
  }

  throw new Error('No Transfer event found in the transaction receipt');
}

export async function getMintInfo(txHash: string) {
  const chainId = Number(chain.chainId);
  const provider = getProvider(chainId);
  const receipt = await provider.getTransactionReceipt(txHash);

  const transferEventSignature = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)')
  );

  const iface = getCoSoulContract().interface;

  if (receipt.logs === undefined) {
    throw new Error('No logs found in the transaction receipt');
  }

  for (const log of receipt.logs) {
    if (log.topics[0] === transferEventSignature) {
      const {
        args: { from, to, tokenId: tokenIdBN },
      } = iface.parseLog(log);
      const tokenId = tokenIdBN.toNumber();

      return { from, to, tokenId };
    }
  }

  throw new Error('No Transfer event found in the transaction receipt');
}

export const getOnChainPGive = async (tokenId: number) => {
  const contract = getCoSoulContract();
  return (await contract.getSlot(PGIVE_SLOT, tokenId)).toNumber();
};

export async function getMintInfofromLogs(log: any) {
  if (log === undefined) return null;
  const iface = getCoSoulContract().interface;
  const {
    args: { from, to, tokenId: tokenIdBN },
  } = iface.parseLog(log);
  const tokenId = tokenIdBN.toNumber();
  return { from, to, tokenId };
}

export const setOnChainPGive = async (params: CoSoulArgs) => {
  return await setSlotOnChain(PGIVE_SLOT, params);
};

export const setOnChainRep = async (params: CoSoulArgs) => {
  return await setSlotOnChain(REP_SLOT, params);
};

// set the on-chain PGIVE balance for a given token
const setSlotOnChain = async (slot: Slot, params: CoSoulArgs) => {
  const contract = getSignedCoSoulContract();
  const amount = Math.floor(params.amount);
  // eslint-disable-next-line no-console
  console.log(
    `updating on-chain cosoul tokenId: ${params.tokenId} slot ${slot} to ${amount}`
  );

  const gasSettings = chain.gasSettings;

  return await contract.setSlot(slot, amount, params.tokenId, gasSettings);
};

const paddedHex = (n: number, length: number = 8): string => {
  const _hex = n.toString(16); // convert number to hexadecimal
  const hexLen = _hex.length;
  const extra = '0'.repeat(length - hexLen);
  if (hexLen === length) {
    return _hex;
  } else if (hexLen < length) {
    return extra + _hex;
  } else {
    throw new Error(
      `Number: ${n} is too large to be padded in length ${length} bytes, _hex: ${_hex}; hexLen: ${hexLen}; extra: ${extra}`
    );
  }
};

const getPayload = (amount: number, tokenId: number): string =>
  paddedHex(amount) + paddedHex(tokenId);

export const setBatchOnChainPGive = async (params: CoSoulArgs[]) => {
  return await setBatchSlotOnChain(PGIVE_SLOT, params);
};
export const setBatchOnChainRep = async (params: CoSoulArgs[]) => {
  return await setBatchSlotOnChain(REP_SLOT, params);
};

/*
 * setBatchSlotOnChain: set a batch of cosoul slots to given values on chain
 * @param params: an array of objects with tokenId and amounts
 * @returns: a promise that resolves when the transaction is mined
 *
 * The contract expects data in the following format:
 * @param _data bytes data
 *    3 bits for slot | one byte
 *    after previous byte, alternate bewteen next elements like a packed array
 *    4 bytes for each amount
 *    4 bytes for each token ID
 */
export const setBatchSlotOnChain = async (slot: Slot, params: CoSoulArgs[]) => {
  let payload = '0x' + paddedHex(slot, 2); // 1byte for slot
  for (const { tokenId, amount } of params) {
    if (amount > 0) {
      // four bytes for pgive and four bytes for tokenId
      payload += getPayload(Math.floor(amount), tokenId);
    }
  }

  // payload is only 0x00 if no pgive needs to be updated on chain
  if (payload.length > 4) {
    const contract = getSignedCoSoulContract();
    const gasSettings = chain.gasSettings;
    const tx = await contract.batchSetSlot_UfO(payload, gasSettings);
    return await tx.wait();
  } else {
    // eslint-disable-next-line no-console
    console.log('No cosouls to update on chain');
    return;
  }
};
