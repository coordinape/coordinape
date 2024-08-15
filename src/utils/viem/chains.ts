import { defineChain } from 'viem';

export const localhost = defineChain({
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
