import { network } from 'hardhat';
import config from '../../hardhat.config';

const { url: jsonRpcUrl, blockNumber } =
  config.networks?.hardhat?.forking || {};

export const resetNetwork = async () =>
  network.provider.request({
    method: 'hardhat_reset',
    params: [{ forking: { jsonRpcUrl, blockNumber } }],
  });
