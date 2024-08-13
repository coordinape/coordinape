import { Hex } from 'viem';

import { testAccounts } from '../../../utils/testing/accountsHelper';
import { snapshotManager } from '../../../utils/testing/snapshotManager';
import { localCI } from '../../../utils/viem/chains';
import { getCoSoulContract } from '../../../utils/viem/contracts';

import {
  getTokenId,
  mintCoSoulForAddress,
  getOnChainPGive,
  setOnChainPGive,
  setBatchOnChainPGive,
  getMintInfo,
} from './cosoul';

describe('cosoul.ts with LocalCI', () => {
  let snapshotId: Hex;
  let cosoul: ReturnType<typeof getCoSoulContract>;
  const wallet = testAccounts.getWalletClient(8);

  beforeEach(async () => {
    snapshotId = await snapshotManager.takeSnapshot();
    cosoul = getCoSoulContract();
  });

  afterEach(async () => {
    await snapshotManager.revertToSnapshot(snapshotId);
  });

  describe('getTokenId', () => {
    it('should return undefined if no token', async () => {
      const result = await getTokenId(wallet.account.address);
      expect(result).toBeUndefined();
    });

    it('should return token ID after minting', async () => {
      await mintCoSoulForAddress(wallet.account.address);
      const result = await getTokenId(wallet.account.address);
      expect(result).toBeDefined();
      expect(typeof result).toBe('bigint');
    });
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

  describe('getMintInfo', () => {
    it('should return correct mint info', async () => {
      // Mint a new CoSoul
      const receipt = await mintCoSoulForAddress(wallet.account.address);

      // Get the mint info
      const mintInfo = await getMintInfo(receipt.transactionHash, localCI.id);

      // Verify the mint info
      expect(mintInfo).toBeDefined();
      expect(mintInfo?.from).toBe('0x0000000000000000000000000000000000000000'); // Minting is from zero address
      expect(mintInfo?.to).toBe(wallet.account.address);

      // Verify that the tokenId in mintInfo matches the one we can get from the contract
      const tokenId = await getTokenId(wallet.account.address);
      expect(mintInfo?.tokenId).toBe(tokenId);

      // Additional verification: check the balance of the recipient
      const balance = await cosoul.read.balanceOf([wallet.account.address]);
      expect(balance).toBe(1n); // Should have 1 token after minting
    });

    it('should throw error for non-existent transaction', async () => {
      const nonExistentHash =
        '0x1234567890123456789012345678901234567890123456789012345678901234';
      await expect(getMintInfo(nonExistentHash, localCI.id)).rejects.toThrow();
    });
  });
});
