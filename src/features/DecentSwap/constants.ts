import { ChainId, TokenInfo, ethGasToken } from '@decent.xyz/box-common';
import { zeroAddress } from 'viem';

import { IN_PRODUCTION } from 'config/env';
import { SvgArbitrum } from 'icons/__generated/Arbitrum';
import { SvgBase } from 'icons/__generated/Base';
import { SvgEthLogo } from 'icons/__generated/EthLogo';
import { SvgOptimismLogo } from 'icons/__generated/OptimismLogo';
import { SvgPolygonMaticLogo } from 'icons/__generated/PolygonMaticLogo';
import { SvgIconProps } from 'ui';

const etherLogo = 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025';
const polygonLogo = 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=025';

export const ethL2GasToken = (chainId: ChainId): TokenInfo => ({
  address: zeroAddress,
  decimals: 18,
  name: 'Ether',
  symbol: 'ETH',
  logo: etherLogo,
  chainId: chainId,
  isNative: true,
});

export const polygonGasToken: TokenInfo = {
  address: zeroAddress,
  decimals: 18,
  name: 'Matic',
  symbol: 'MATIC',
  logo: polygonLogo,
  chainId: ChainId.POLYGON,
  isNative: true,
};

export const chainInfo: {
  [key: number]: { name: string; icon: (props: SvgIconProps) => JSX.Element };
} = {
  ...(IN_PRODUCTION
    ? {
        [ChainId.ETHEREUM]: { name: 'Ethereum', icon: SvgEthLogo },
        [ChainId.OPTIMISM]: { name: 'OP Mainnet', icon: SvgOptimismLogo },
        [ChainId.POLYGON]: { name: 'Polygon', icon: SvgPolygonMaticLogo },
        [ChainId.BASE]: { name: 'Base', icon: SvgBase },
        [ChainId.ARBITRUM]: { name: 'Arbitrum', icon: SvgArbitrum },
      }
    : {
        [ChainId.ETHEREUM]: { name: 'Ethereum', icon: SvgEthLogo },
        [ChainId.OPTIMISM]: { name: 'OP Mainnet', icon: SvgOptimismLogo },
        [ChainId.POLYGON]: { name: 'Polygon', icon: SvgPolygonMaticLogo },
        [ChainId.BASE]: { name: 'Base', icon: SvgBase },
        [ChainId.ARBITRUM]: { name: 'Arbitrum', icon: SvgArbitrum },
        [ChainId.OPTIMISM_SEPOLIA]: {
          name: 'OP Sepolia',
          icon: SvgOptimismLogo,
        },
        [ChainId.SEPOLIA]: { name: 'Sepolia', icon: SvgEthLogo },
      }),
};

export function getDefaultToken(chainId: ChainId) {
  switch (chainId) {
    case ChainId.OPTIMISM:
      return { ...ethL2GasToken(ChainId.OPTIMISM), chainId };
    case ChainId.OPTIMISM_SEPOLIA:
      return { ...ethL2GasToken(ChainId.OPTIMISM_SEPOLIA), chainId };
    case ChainId.POLYGON:
      return { ...polygonGasToken, chainId };
    case ChainId.BASE:
      return { ...ethL2GasToken(ChainId.BASE), chainId };
    case ChainId.ARBITRUM:
      return { ...ethL2GasToken(ChainId.ARBITRUM), chainId };
    default:
      return { ...ethGasToken, chainId };
  }
}
