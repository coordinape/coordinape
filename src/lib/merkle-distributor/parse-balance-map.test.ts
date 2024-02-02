import { BigNumber } from 'ethers';

import BalanceTree from './balance-tree';
import { input, output as expectedOutput } from './fixtures.json';
import { parseBalanceMap } from './parse-balance-map';

test('verify proof for simple 2-entry map', () => {
  const map = {
    '0xabc0000000000000000000000000000000000001': 2000000000,
    '0xdef0000000000000000000000000000000000002': 3000000000,
  };
  const info = parseBalanceMap(map);
  Object.entries(info.claims).forEach(([account, { index, amount, proof }]) => {
    const check = BalanceTree.verifyProof(
      index,
      account,
      BigNumber.from(amount),
      proof.map(hex => Buffer.from(hex.substring(2), 'hex')),
      Buffer.from(info.merkleRoot.substring(2), 'hex')
    );
    expect(check).toBeTruthy();
  });
});

test('produce same output as fixture created by brownie', () => {
  const actualOutput = parseBalanceMap(input);
  expect(actualOutput).toStrictEqual(expectedOutput);

  Object.entries(expectedOutput.claims).forEach(
    ([account, { index, amount, proof }]) => {
      const check = BalanceTree.verifyProof(
        index,
        account,
        BigNumber.from(amount),
        proof.map(hex => Buffer.from(hex.substring(2), 'hex')),
        Buffer.from(expectedOutput.merkleRoot.substring(2), 'hex')
      );
      expect(check).toBeTruthy();
    }
  );
});
