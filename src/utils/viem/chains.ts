import { defineChain } from 'viem';

import {
  HARDHAT_GANACHE_CHAIN_ID,
  HARDHAT_GANACHE_PORT,
  IN_TEST,
} from '../../config/env';

const localGanache = defineChain({
  id: 1338,
  name: 'Localhost 8546',
  rpcUrls: {
    default: {
      http: ['http://localhost:8546'],
    },
  },
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {},
});

export const localCI = defineChain({
  id: HARDHAT_GANACHE_CHAIN_ID,
  name: 'Localhost CI 8547',
  rpcUrls: {
    default: {
      http: [`http://localhost:${HARDHAT_GANACHE_PORT}`],
    },
  },
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  gasSettings: {},
});

function getLocalChain() {
  return IN_TEST ? localCI : localGanache;
}

export const localhost = getLocalChain();
