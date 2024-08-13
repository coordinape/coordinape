import { Hex, createTestClient, http, TestClient } from 'viem';

import { HARDHAT_GANACHE_PORT } from '../../config/env';
import { localCI } from '../../utils/viem/chains';

class SnapshotManager {
  private client: TestClient;
  private snapshots: Hex[] = [];

  constructor(rpcUrl: string = `http://localhost:${HARDHAT_GANACHE_PORT}`) {
    this.client = createTestClient({
      mode: 'ganache',
      chain: localCI,
      transport: http(rpcUrl),
    });
  }

  async takeSnapshot() {
    const snapshotId = await this.client.snapshot();
    this.snapshots.push(snapshotId);
    return snapshotId;
  }

  async revertToSnapshot(snapshotId?: Hex): Promise<void> {
    const idToRevert = snapshotId || this.snapshots.pop();
    if (!idToRevert) {
      throw new Error('No snapshot to revert to');
    }

    await this.client.revert({ id: idToRevert });

    if (!snapshotId) {
      // If we're using the latest snapshot, we need to remove it from our list
      this.snapshots.pop();
    }
  }

  async revertToLatest(): Promise<void> {
    return this.revertToSnapshot();
  }

  getSnapshots() {
    return [...this.snapshots];
  }
}

export const snapshotManager = new SnapshotManager();
