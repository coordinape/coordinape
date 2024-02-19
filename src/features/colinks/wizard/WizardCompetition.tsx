import { Flex, Text } from 'ui';

import { SkipButton } from './SkipButton';
import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardCompetition = ({ skipStep }: { skipStep: () => void }) => {
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, #1F1518 10%, #73CFCE 38%, #DCE6CA 72%, #B56C6A 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-other.jpg')",
          backgroundPosition: 'bottom',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$sm' }}>
          <Text h2>Eth Denver Invitee Competiton</Text>
          <Text inline size={'small'}>
            You you are enrolled to a competition
          </Text>
        </Flex>
        <SkipButton onClick={skipStep} />
      </WizardInstructions>
    </>
  );
};
