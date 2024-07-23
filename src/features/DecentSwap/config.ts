import { ChainId } from '@decent.xyz/box-common';

import { IN_PRODUCTION } from 'config/env';

export const defaultAvailableChains = [
  ChainId.ETHEREUM,
  ChainId.OPTIMISM,
  ChainId.POLYGON,
  ChainId.BASE,
  ChainId.ARBITRUM,
  ...(!IN_PRODUCTION ? [ChainId.SEPOLIA, ChainId.OPTIMISM_SEPOLIA] : []),
];
