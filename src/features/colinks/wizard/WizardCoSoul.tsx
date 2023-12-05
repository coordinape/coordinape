import { Dispatch, useState } from 'react';

import { CoLinksMintPage } from 'features/cosoul/CoLinksMintPage';
import { CoSoulButton } from 'features/cosoul/CoSoulButton';

import { Flex, Text } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardCoSoul = ({
  setShowStepCoSoul,
}: {
  setShowStepCoSoul: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [minted, setMinted] = useState(false);
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, rgb(18 19 21) 0%, #31641F 38%, #66D439 63%, #793FE0 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-cosoul.jpg')",
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$md' }}>
          <Text h2>Attain your CoSoul NFT</Text>
          <Text>
            CoSoul holds your Rep Score on-chain, is synced monthly, and is a
            public view of your stats and username.
          </Text>
          <Text>CoSoul: YOUR key to the network.</Text>
          {!minted && (
            <Flex column css={{ mt: '$md', gap: '$md' }}>
              <CoSoulButton onReveal={() => setMinted(true)} />
              <Text size="small" color="neutral">
                There is a small fee to mint a CoSoul, and gas costs are minimal
                on Optimism.
              </Text>
            </Flex>
          )}
        </Flex>
      </WizardInstructions>
      <Flex
        css={{
          zIndex: 3,
          pointerEvents: 'none',
          overflow: 'auto',
          height: '100vh',
        }}
      >
        <CoLinksMintPage
          minted={minted}
          setShowStepCoSoul={setShowStepCoSoul}
        />
      </Flex>
    </>
  );
};
