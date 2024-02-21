import { ArrowRight } from 'icons/__generated';
import { Button, Flex, Link, Text } from 'ui';

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
          backgroundImage: "url('/imgs/background/eth-denver.jpg')",
          backgroundPosition: '50% 65%',
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$md' }}>
          <Text h2>Congratulations!</Text>
          <Text h2>You&apos;ve entered the ETH Denver 2024 Contest!</Text>
          <Text>
            Invite your friends to CoLinks, and for each one that joins
            you&apos;ll receive an additional contest entry (max 10 additional
            entries).
          </Text>
          <Text inline>
            Once you&apos;re in the app, visit the{' '}
            <Text inline semibold>
              Invites Page.
            </Text>
          </Text>
          <Button
            outlined
            color={'secondary'}
            as={Link}
            inlineLink
            onClick={skipStep}
            css={{
              '&:hover': { textDecoration: 'none' },
              width: '100%',
              alignItems: 'center',
              gap: '$xs',
            }}
          >
            <Text>Continue</Text> <ArrowRight />
          </Button>
        </Flex>
      </WizardInstructions>
    </>
  );
};
