import { TransactionReceipt } from '@ethersproject/providers';
import { BigNumber, BytesLike, ethers, Wallet } from 'ethers';

import { COSOUL_SIGNER_ADDR_PK } from '../../../../api-lib/config';
import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../chains';
import { Contracts } from '../contracts';

export const PGIVE_SLOT = 0;
export const PGIVE_SYNC_DURATION_DAYS = 30;

export const paddedHex = (
  n: number,
  length: number = 8,
  prefix: boolean = false
): string => {
  const _hex = n.toString(16); // convert number to hexadecimal
  const hexLen = _hex.length;
  const extra = '0'.repeat(length - hexLen);
  let pre = '0x';
  if (!prefix) {
    pre = '';
  }
  if (hexLen === length) {
    return pre + _hex;
  } else if (hexLen < length) {
    return pre + extra + _hex;
  } else {
    return '?'.repeat(length); //it's hardf for pgive to need more than four bytes
  }
};

export const getPayload = (pGIVE: number, tokenId: number): string =>
  paddedHex(pGIVE) + paddedHex(tokenId);

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
  console.log('balanceOf: ', balanceOf);
  // if they don't have a balance there is nothing more to do
  if (balanceOf === 0) {
    return undefined;
  }

  // fetch their first token because they can only have one per the contract
  return (
    await contract.tokenOfOwnerByIndex(address, BigNumber.from(0))
  ).toNumber();
};

// get the on-chain PGIVE balance for a given token
export const getOnChainPGIVE = async (tokenId: number) => {
  const contract = getCoSoulContract();
  return (await contract.getSlot(PGIVE_SLOT, tokenId)).toNumber();
};

// set the on-chain PGIVE balance for a given token
export const setOnChainPGIVE = async (tokenId: number, amt: number) => {
  const contract = getSignedCoSoulContract();
  const amount = Math.floor(amt);
  // eslint-disable-next-line no-console
  console.log(
    'setting on chain PGIVE for tokenId: ' + tokenId + ' to ' + amount
  );

  const gasSettings = chain.gasSettings;

  return await contract.setSlot(PGIVE_SLOT, amount, tokenId, gasSettings);
};

// set the on-chain PGIVE balance for multiple tokens
export const setBatchOnChainPGIVE = async (data: BytesLike) => {
  const contract = getSignedCoSoulContract();
  const gasSettings = chain.gasSettings;
  return await contract.batchSetSlot_UfO(data, gasSettings);
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

export async function getMintInfofromLogs(log: any) {
  if (log === undefined) return null;
  const iface = getCoSoulContract().interface;
  const {
    args: { from, to, tokenId: tokenIdBN },
  } = iface.parseLog(log);
  const tokenId = tokenIdBN.toNumber();
  return { from, to, tokenId };
}
