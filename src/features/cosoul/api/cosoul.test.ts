/* eslint-disable no-console */
import assert from 'assert';

import { provider, restoreSnapshot, takeSnapshot } from 'utils/testing';
import { getCoSoulContract } from 'utils/viem/contracts';

import {
  getMintInfo,
  getOnChainPGive,
  getTokenId,
  mintCoSoulForAddress,
  setBatchOnChainPGive,
  setOnChainPGive,
} from './cosoul';

import { Awaited } from 'types/shim';

let cosoul;
let snapshotId: string;
let mainAccount: string;
let tokenId: Awaited<ReturnType<typeof getTokenId>>;

beforeEach(async () => {
  snapshotId = await takeSnapshot();

  mainAccount = (await provider().listAccounts())[0];
  cosoul = getCoSoulContract();
});

afterEach(async () => {
  await restoreSnapshot(snapshotId);
});

test('getTokenId returns undefined if no nft exists', async () => {
  const tokenIdFetch = await getTokenId(mainAccount);
  expect(tokenIdFetch).toEqual(undefined);
});

test('getMintInfo returns mint info', async () => {
  // const tx = await contract.mint();
  const tx = await cosoul.write;
  const data = await getMintInfo(tx.hash);
  expect(data).toEqual({
    from: '0x0000000000000000000000000000000000000000',
    to: mainAccount,
    tokenId: 1,
  });
});

test('mintCoSoulForAddress mints to a given address', async () => {
  const address = (await provider().listAccounts())[10];
  const tx = await mintCoSoulForAddress(address);

  const data = await getMintInfo(tx.hash);
  expect(data).toEqual({
    from: '0x0000000000000000000000000000000000000000',
    to: address,
    tokenId: 1,
  });
});

describe('with a minted nft', () => {
  beforeEach(async () => {
    await contract.mint();
  });

  describe('with a tokenId', () => {
    beforeEach(async () => {
      tokenId = await getTokenId(mainAccount);
    });

    test('getTokenId returns the tokenId', async () => {
      expect(tokenId).toEqual(1);
    });

    test('getOnChainPGive returns 0 before slot is set', async () => {
      assert(tokenId);
      expect(await getOnChainPGive(tokenId)).toEqual(0);
    });

    test('setOnChainPGive sets slot value', async () => {
      assert(tokenId);
      const amount = 300;
      await setOnChainPGive({ tokenId, amount });
      expect(await getOnChainPGive(tokenId)).toEqual(300);
    });

    test('setBatchOnChainPGive sets slot value', async () => {
      assert(tokenId);

      const args = [{ amount: 324, tokenId }];

      await setBatchOnChainPGive(args);
      expect(await getOnChainPGive(tokenId)).toEqual(324);
    });
  });
});
