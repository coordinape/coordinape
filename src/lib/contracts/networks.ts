export enum NETWORK_TYPES {
  MAINNET = 'MAINNET',
  RINKEBY = 'RINKEBY',
  ROPSTEN = 'ROPSTEN',
  LOCAL = 'LOCAL',
  KOVAN = 'KOVAN',
}

export const defaultNetworkId = Number(42);

export const chainIdToNetworkType = (chainId: number): NETWORK_TYPES => {
  switch (chainId) {
    case 1:
      return NETWORK_TYPES.MAINNET;
    case 3:
      return NETWORK_TYPES.ROPSTEN;
    case 4:
      return NETWORK_TYPES.RINKEBY;
    case 42:
      return NETWORK_TYPES.KOVAN;
    default:
      return NETWORK_TYPES.LOCAL;
  }
};
