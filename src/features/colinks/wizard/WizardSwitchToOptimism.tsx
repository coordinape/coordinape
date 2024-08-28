import { useSwitchChain } from 'wagmi';

import { useToast } from '../../../hooks';
import { OptimismLogo } from '../../../icons/__generated';
import { Button, Flex, Text } from '../../../ui';
import { chain } from '../../cosoul/chains';
// import { switchOrAddNetwork } from 'utils/provider';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export function WizardSwitchToOptimism() {
  const { showError } = useToast();

  const { switchChain } = useSwitchChain();

  // const { savedAuth } = useSavedAuth();

  const safeSwitchToCorrectChain = async () => {
    // TODO: test me with chain not setup
    try {
      switchChain({
        //@ts-ignore
        chainId: Number(chain.chainId),
        // addEthereumChainParameter: {
        //   chainId: chain.chainId,
        //   chainName: chain.chainName,
        //   nativeCurrency: {
        //     name: chain.nativeCurrency.name,
        //     symbol: chain.nativeCurrency.symbol,
        //     decimals: chain.nativeCurrency.decimals,
        //   },
        //   rpcUrls: chain.rpcUrls,
        //   blockExplorerUrls: chain.blockExplorerUrls,
        // },
      });
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, #F02A2D 58%, #FEA275 83%, #8DA9AF 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-op.jpg')",
          backgroundPosition: '50% 65%',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$md' }}>
          <Text h2>Awesome!</Text>
          <Text>
            Let&apos;s get you on the{' '}
            <OptimismLogo nostroke css={{ mx: '$xs' }} /> Optimism chain.
          </Text>

          <Button color="cta" size="large" onClick={safeSwitchToCorrectChain}>
            Switch to {chain.chainName} to Use CoLinks
          </Button>
        </Flex>
      </WizardInstructions>
    </>
  );
}
