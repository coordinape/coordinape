import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';

import { Flex, Text } from 'ui';

export const NotFound = () => {
  return (
    <>
      <Flex css={{ position: 'relative' }}>
        <WizardInstructions suppressHeader>
          <Flex column css={{ gap: '$md' }}>
            <Text semibold css={{ fontSize: '$h2' }}>
              404 Not Found
            </Text>
            <Text p as="p">
              Thanks for looking in this chest.
              <br />
              There is nothing here.
            </Text>
          </Flex>
        </WizardInstructions>

        <Flex
          css={{
            ...fullScreenStyles,
            position: 'absolute',
            zIndex: '0',
            width: '100%',
            background:
              'radial-gradient(circle, #E3A102 10%, #5D778F 68%, #2D3C49 83%, #C1D5E1 100%)',
          }}
        />
        <Flex
          css={{
            ...fullScreenStyles,
            width: '100%',
            position: 'absolute',
            zIndex: '1',
            animationDirection: 'alternate',
            backgroundImage: "url('/imgs/background/colink-404.jpg')",
            backgroundPosition: '50% 50% ',
          }}
        />
      </Flex>
    </>
  );
};
