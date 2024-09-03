import { Hex } from 'viem';

import { getTokenId } from '../../src/features/cosoul/api/cosoul';
import { testAccounts } from '../../src/utils/testing/accountsHelper';
import { snapshotManager } from '../../src/utils/testing/snapshotManager';

import {
  mintCoSoulForAddress,
  getOnChainPGive,
  setOnChainPGive,
  setBatchOnChainPGive,
} from './contracts';

describe('contracts.ts with LocalCI', () => {
  let snapshotId: Hex;
  const wallet = testAccounts.getWalletClient(8);

  beforeEach(async () => {
    snapshotId = await snapshotManager.takeSnapshot();
  });

  afterEach(async () => {
    await snapshotManager.revertToSnapshot(snapshotId);
  });

  describe('mintCoSoulForAddress', () => {
    it('should mint a CoSoul', async () => {
      const receipt = await mintCoSoulForAddress(wallet.account.address);
      expect(receipt.status).toBe('success');

      const tokenId = await getTokenId(wallet.account.address);
      expect(tokenId).toBeDefined();
    });
  });

  describe('getOnChainPGive', () => {
    it('should return 0 for newly minted token', async () => {
      await mintCoSoulForAddress(wallet.account.address);
      const tokenId = await getTokenId(wallet.account.address);
      const pgive = await getOnChainPGive(Number(tokenId));
      expect(pgive).toBe(0n);
    });
  });

  describe('setOnChainPGive', () => {
    it('should set PGIVE balance for a given token ID', async () => {
      await mintCoSoulForAddress(wallet.account.address);
      const tokenId = await getTokenId(wallet.account.address);

      await setOnChainPGive({ tokenId: Number(tokenId), amount: 100 });

      const pgive = await getOnChainPGive(Number(tokenId));
      expect(pgive).toBe(100n);
    });
  });

  describe('setBatchOnChainPGive', () => {
    it('should set batch PGIVE balances', async () => {
      await mintCoSoulForAddress(wallet.account.address);
      const tokenId1 = await getTokenId(wallet.account.address);

      const wallet2 = testAccounts.getWalletClient(1);
      await mintCoSoulForAddress(wallet2.account.address);
      const tokenId2 = await getTokenId(wallet2.account.address);

      const params = [
        { tokenId: Number(tokenId1), amount: 100 },
        { tokenId: Number(tokenId2), amount: 200 },
      ];

      await setBatchOnChainPGive(params);

      const pgive1 = await getOnChainPGive(Number(tokenId1));
      const pgive2 = await getOnChainPGive(Number(tokenId2));

      expect(pgive1).toBe(100n);
      expect(pgive2).toBe(200n);
    });
  });
});
