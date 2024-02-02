// original: https://github.com/Uniswap/merkle-distributor/blob/master/src/balance-tree.ts

import { AddressZero } from '@ethersproject/constants';
import { BigNumber, utils } from 'ethers';

import MerkleTree from './merkle-tree';

export default class BalanceTree {
  private readonly tree: MerkleTree;
  constructor(balances: { account: string; amount: BigNumber }[]) {
    const nodes = balances.map(({ account, amount }, index) => {
      return BalanceTree.toNode(index, account, amount);
    });

    let paddedLength = 1;
    while (paddedLength < nodes.length) paddedLength *= 2;

    while (nodes.length < paddedLength) {
      nodes.push(
        BalanceTree.toNode(nodes.length, AddressZero, BigNumber.from(0))
      );
    }

    this.tree = new MerkleTree(nodes);
  }

  public static verifyProof(
    index: number | BigNumber,
    account: string,
    amount: BigNumber,
    proof: Buffer[],
    root: Buffer
  ): boolean {
    if (root.length === 0) throw new Error('root has 0 length');
    let pair = BalanceTree.toNode(index, account, amount);
    for (const item of proof) {
      pair = MerkleTree.combinedHash(pair, item);
    }

    return pair.equals(root);
  }

  // keccak256(abi.encode(index, account, amount))
  public static toNode(
    index: number | BigNumber,
    account: string,
    amount: BigNumber
  ): Buffer {
    return Buffer.from(
      utils
        .solidityKeccak256(
          ['uint256', 'address', 'uint256'],
          [index, account, amount]
        )
        .substr(2),
      'hex'
    );
  }

  public getHexRoot(): string {
    return this.tree.getHexRoot();
  }

  // returns the hex bytes32 values of the proof
  public getProof(
    index: number | BigNumber,
    account: string,
    amount: BigNumber
  ): string[] {
    return this.tree.getHexProof(BalanceTree.toNode(index, account, amount));
  }
}
