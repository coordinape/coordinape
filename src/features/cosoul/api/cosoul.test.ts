import { Hex } from 'viem';

import { mintCoSoulForAddress } from '../../../../api-lib/viem/contracts';
import { testAccounts } from '../../../utils/testing/accountsHelper';
import { snapshotManager } from '../../../utils/testing/snapshotManager';
import { localCI } from '../../../utils/viem/chains';
import { getCoSoulContract } from '../../../utils/viem/contracts';

import { getTokenId, getMintInfo } from './cosoul';

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
