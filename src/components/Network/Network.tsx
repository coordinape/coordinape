import { loginSupportedChainIds } from 'common-lib/constants';

import {
  AuroraLogo,
  EthColorLogo,
  EthLogo,
  FantomLogo,
  GanacheLogo,
  OptimismLogo,
  PolygonMaticLogo,
} from 'icons/__generated';
import { Flex, Text } from 'ui';

export const Network = ({
  chainId,
  children,
}: {
  chainId: number;
  children?: React.ReactNode;
}) => {
  const chainLogos: Record<number, any> = {
    1: <EthLogo nostroke />,
    5: <EthColorLogo nostroke />,
    10: <OptimismLogo nostroke />,
    137: <PolygonMaticLogo nostroke />,
    1338: <GanacheLogo nostroke />,
    250: <FantomLogo nostroke />,
    1313161554: <AuroraLogo nostroke />,
  };
  const chainName = loginSupportedChainIds[chainId] || 'Unknown Chain';
  return (
    <Flex
      key={chainId}
      css={{
        width: '$full',
        alignItems: 'center',
        gap: '$xs',
      }}
    >
      {chainLogos[chainId]}
      <Text size="small">{chainName}</Text>
      {children}
    </Flex>
  );
};

export default Network;
