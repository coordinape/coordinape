import assert from 'assert';
import React from 'react';

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

  const { library } = useWeb3React();
  const safeSwitchToCorrectChain = async () => {
    try {
      assert(library);
      await switchToCorrectChain(library);
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };
  return (
    <>
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-op.jpg')",
        }}
      />
      <WizardInstructions>
        <Text h2>Awesome!</Text>
        <Text>
          Let&apos;s get you on the{' '}
          <OptimismLogo nostroke css={{ mx: '$xs' }} /> Optimism chain.
        </Text>

        <Button color="cta" size="large" onClick={safeSwitchToCorrectChain}>
          Switch to {chain.chainName} to Use CoLinks
        </Button>
      </WizardInstructions>
    </>
  );
}
