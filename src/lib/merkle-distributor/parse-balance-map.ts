// original: https://github.com/Uniswap/merkle-distributor/blob/master/src/parse-balance-map.ts

import { BigNumber, utils } from 'ethers';

import BalanceTree from './balance-tree';

const { isAddress } = utils;

// This is the blob that gets distributed and pinned to IPFS.
// It is completely sufficient for recreating the entire merkle tree.
// Anyone can verify that all air drops are included in the tree,
// and the tree has no additional distributions.
export interface MerkleDistributorInfo {
  merkleRoot: string;
  tokenTotal: string;
  previousTotal?: string;
  claims: {
    [account: string]: {
      index: number;
      amount: string;
      proof: string[];
      flags?: {
        [flag: string]: boolean;
      };
    };
  };
}

type OldFormat = { [account: string]: number | string };
type NewFormat = { address: string; earnings: string | BigNumber };

export function parseBalanceMap(
  balances: OldFormat | NewFormat[]
): MerkleDistributorInfo {
  // if balances are in an old format, process them
  const balancesInNewFormat: NewFormat[] = Array.isArray(balances)
    ? balances
    : Object.keys(balances).map(
        (account): NewFormat => ({
          address: account,
          earnings: `0x${balances[account].toString(16)}`,
        })
      );

  const dataByAddress = balancesInNewFormat.reduce<{
    [address: string]: {
      amount: BigNumber;
      flags?: { [flag: string]: boolean };
    };
  }>((memo, { address: account, earnings }) => {
    if (!isAddress(account)) {
      throw new Error(`Found invalid address: ${account}`);
    }
    const parsed = account.toLowerCase();
    if (memo[parsed]) throw new Error(`Duplicate address: ${parsed}`);
    const parsedNum = BigNumber.from(earnings);
    if (parsedNum.lte(0))
      throw new Error(`Invalid amount for account ${account}: "${earnings}"`);

    memo[parsed] = { amount: parsedNum };
    return memo;
  }, {});

  const sortedAddresses = Object.keys(dataByAddress).sort();
  // construct a tree
  const tree = new BalanceTree(
    sortedAddresses.map(address => ({
      account: address,
      amount: dataByAddress[address].amount,
    }))
  );

  // generate claims
  const claims = sortedAddresses.reduce<{
    [address: string]: {
      amount: string;
      index: number;
      proof: string[];
    };
  }>((memo, address, index) => {
    const { amount } = dataByAddress[address];
    memo[address] = {
      index,
      amount: amount.toString(),
      proof: tree.getProof(index, address, amount),
    };
    return memo;
  }, {});

  const tokenTotal: BigNumber = sortedAddresses.reduce<BigNumber>(
    (memo, key) => memo.add(dataByAddress[key].amount),
    BigNumber.from(0)
  );

  return {
    merkleRoot: tree.getHexRoot(),
    tokenTotal: tokenTotal.toString(),
    claims,
  };
}
