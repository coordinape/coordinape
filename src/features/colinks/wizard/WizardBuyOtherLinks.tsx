import { Flex, Text, Panel, Link } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardBuyOtherLinks = ({ skipStep }: { skipStep: () => void }) => {
  return (
    <>
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-other.jpg')",
        }}
      />
      <WizardInstructions>
        <Text h2>Connect by purchasing someone&apos;s Link</Text>
        <Text>Here are some recommendations</Text>
        <Panel nested>TODO show 5 from your network</Panel>
        <Link inlineLink onClick={skipStep}>
          Skip for now
        </Link>
        <Text size="small">
          You can add purchase other Links later by visiting the Explore page.
        </Text>
      </WizardInstructions>
    </>
  );
};
