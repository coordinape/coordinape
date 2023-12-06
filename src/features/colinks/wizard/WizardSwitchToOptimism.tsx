import assert from 'assert';
import React from 'react';

import { getMagicProvider } from 'features/auth/magic';
import { useSavedAuth } from 'features/auth/useSavedAuth';

import { useToast } from '../../../hooks';
import { useWeb3React } from '../../../hooks/useWeb3React';
import { OptimismLogo } from '../../../icons/__generated';
import { Button, Flex, Text } from '../../../ui';
import { chain } from '../../cosoul/chains';
import { switchToCorrectChain } from '../../web3/chainswitch';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export function WizardSwitchToOptimism() {
  const { showError } = useToast();

  const { library, setProvider } = useWeb3React();
  const { savedAuth } = useSavedAuth();

  const safeSwitchToCorrectChain = async () => {
    try {
      if (savedAuth.connectorName == 'magic') {
        const provider = await getMagicProvider('optimism');
        await setProvider(provider, 'magic');
      } else {
        assert(library);
        await switchToCorrectChain(library);
      }
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
