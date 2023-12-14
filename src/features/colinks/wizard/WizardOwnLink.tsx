import React from 'react';

import { MAX_BASE_FEE_STRING } from '../../../pages/colinks/explore/getPriceWithFees';
import { BuyOrSellCoLinks } from '../BuyOrSellCoLinks';
import { CoLinksProvider } from '../CoLinksContext';
import { Flex, InfoTooltip, Text } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardOwnLink = ({ address }: { address: string }) => {
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, #E3A102 25%, #FFF9BC 58%, #BCDBDA 88%, #FFFCDE 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-own.jpg')",
          backgroundPosition: '50% 75%',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$md', mb: '$md' }}>
          <Text h2>Create your first link</Text>
          <Text>
            Your first Link adds you to the network and allows other CoLinks
            members to buy it too.
          </Text>
          <Text>
            Links are connections between people, they allow sharing of ideas
            and discussion, and a web of mutual reputation to form.
          </Text>
          <Text inline css={{ alignItems: 'center' }}>
            Your address will receive half of the fees when your links are
            bought or sold. <FeesTooltip />
          </Text>
        </Flex>
        <CoLinksProvider>
          <BuyOrSellCoLinks subject={address} address={address} />
        </CoLinksProvider>
      </WizardInstructions>
    </>
  );
};

const FeesTooltip = () => {
  return (
    <InfoTooltip size={'md'}>
      Fees are 10% of the price plus a base fee of {MAX_BASE_FEE_STRING} ETH.
      When sell price is low, the base fee is scaled down.
    </InfoTooltip>
  );
};
