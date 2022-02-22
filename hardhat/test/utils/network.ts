import { network } from 'hardhat';
import config from '../../hardhat.config';

const { url: jsonRpcUrl, blockNumber } =
  config.networks?.hardhat?.forking || {};

export const takeSnapshot = async (): Promise<string> => {
  return (await network.provider.request({
    method: 'evm_snapshot',
    params: [],
  })) as string;
};

export const restoreSnapshot = async (snapshotId?: string) => {
  if (!snapshotId) {
    console.error('No snapshot ID provided; not reverting.');
    return;
  }
  return network.provider.request({
    method: 'evm_revert',
    params: [snapshotId],
  });
};

export const resetNetwork = async () =>
  network.provider.request({
    method: 'hardhat_reset',
    params: [{ forking: { jsonRpcUrl, blockNumber } }],
  });
