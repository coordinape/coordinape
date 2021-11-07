import { ContractAddresses } from './contracts';
import { NETWORK_TYPES } from './networks';

// TODO: remove any, fix network types
const addresses: { [network in NETWORK_TYPES]: ContractAddresses } = {
  [NETWORK_TYPES.KOVAN]: {
    contractNameHere: 'Address here',
  },
} as any;

export default addresses;
