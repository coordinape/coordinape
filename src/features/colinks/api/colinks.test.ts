import { Hex } from 'viem';

import { testAccounts } from '../../../utils/testing/accountsHelper';
import { snapshotManager } from '../../../utils/testing/snapshotManager';
import { localCI } from '../../../utils/viem/chains';
import { getCoLinksContractWithWallet } from '../../../utils/viem/contracts';

describe('My Test Suite', () => {
  let snapshotId: Hex;

  beforeAll(async () => {
    snapshotId = await snapshotManager.takeSnapshot();
  });

  afterEach(async () => {
    await snapshotManager.revertToSnapshot(snapshotId);
  });

  it('allows account to buy its own link', async () => {
    const wallet = testAccounts.getWalletClient(0);
    const colink = getCoLinksContractWithWallet(wallet);

    expect(
      await colink.read.linkBalance([
        wallet.account.address,
        wallet.account.address,
      ])
    ).toEqual(0n);

    await colink.write.buyLinks([wallet.account.address, 1n] as const, {
      chain: localCI,
      value: 0n,
      account: wallet.account,
    });

    expect(
      await colink.read.linkBalance([
        wallet.account.address,
        wallet.account.address,
      ])
    ).toEqual(1n);
  });
});
