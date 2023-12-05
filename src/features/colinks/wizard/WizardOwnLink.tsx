import { BuyOrSellCoLinks } from '../BuyOrSellCoLinks';
import { CoLinksProvider } from '../CoLinksContext';
import { Flex, Text } from 'ui';

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
          <Text>
            Your wallet will receive 5% of the price when your Links are bought
            and sold.
          </Text>
        </Flex>
        <CoLinksProvider>
          <BuyOrSellCoLinks subject={address} address={address} />
        </CoLinksProvider>
      </WizardInstructions>
    </>
  );
};
