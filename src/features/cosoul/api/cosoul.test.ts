/* eslint-disable no-console */
import assert from 'assert';

import { CoSoul } from '@coordinape/contracts/typechain';
import { ethers } from 'ethers';

import { Contracts } from '../contracts';
import { provider, restoreSnapshot, takeSnapshot } from 'utils/testing';

import {
  PGIVE_SLOT,
  getMintInfo,
  getOnChainPGIVE,
  getTokenId,
  paddedHex,
  setOnChainPGIVE,
} from './cosoul';

import { Awaited } from 'types/shim';

let contract: CoSoul;
let snapshotId: string;
let accounts: string[];
let mainAccount: string;
let secondAccount: string;
let tokenId: Awaited<ReturnType<typeof getTokenId>>;

beforeEach(async () => {
  snapshotId = await takeSnapshot();
  accounts = await provider().listAccounts();
  mainAccount = accounts[0];
  secondAccount = accounts[1];
  contract = (await Contracts.fromProvider(provider())).cosoul;
});

afterEach(async () => {
  await restoreSnapshot(snapshotId);
});

test('getTokenId returns undefined if no nft exists', async () => {
  const tokenIdFetch = await getTokenId(mainAccount);
  expect(tokenIdFetch).toEqual(undefined);
});

test('getMintInfo returns mint info', async () => {
  const tx = await contract.mint();
  const data = await getMintInfo(tx.hash);
  expect(data).toEqual({
    from: '0x0000000000000000000000000000000000000000',
    to: mainAccount,
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

    test('getOnChainPGIVE returns 0 before slot is set', async () => {
      assert(tokenId);
      expect(await getOnChainPGIVE(tokenId)).toEqual(0);
    });

    test('setOnChainPGIVE sets slot value', async () => {
      assert(tokenId);
      let payload = paddedHex(PGIVE_SLOT, 2, true);
      payload += paddedHex(324, 8, false) + paddedHex(tokenId, 8, false);
      const bytesData = ethers.utils.arrayify(payload);

      await setOnChainPGIVE(bytesData);
      expect(await getOnChainPGIVE(tokenId)).toEqual(324);
    });
  });
});

test('update pgives for multiple users', async () => {
  const tx = await contract.connect(mainAccount).mintTo(secondAccount);
  const data = await getMintInfo(tx.hash);
  expect(data).toEqual({
    from: '0x0000000000000000000000000000000000000000',
    to: secondAccount,
    tokenId: 1,
  });
});
