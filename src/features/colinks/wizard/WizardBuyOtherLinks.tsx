import { CoLinksProvider } from '../CoLinksContext';
import { LeaderboardMostLinks } from '../LeaderboardMostLinks';
import { Flex, Text } from 'ui';

import { SkipButton } from './SkipButton';
import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardBuyOtherLinks = ({
  skipStep,
}: {
  address: string;
  skipStep: () => void;
}) => {
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
          <Text h2>Buy Some Links</Text>
          <Text inline size={'small'}>
            Linked members <strong>both</strong> see each other&apos;s posts
          </Text>
        </Flex>

        <CoLinksProvider>
          <LeaderboardMostLinks limit={5} size={'medium'} hideRank={true} />
        </CoLinksProvider>
        <SkipButton onClick={skipStep} />
      </WizardInstructions>
    </>
  );
};
