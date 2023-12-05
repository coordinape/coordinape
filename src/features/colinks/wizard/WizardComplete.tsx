import { RedeemInviteCode } from 'features/invites/RedeemInviteCode';
import { NavLink } from 'react-router-dom';

import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Text } from 'ui';

import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardComplete = () => {
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, #ffffff 20%, #DCC3C9 58%, #FFFFFF 78%, #4A5F80 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-explore.jpg')",
        }}
      />
      <WizardInstructions>
        <Flex column css={{ gap: '$md' }}>
          <Text h2>You&apos;ve Completed the Quest!</Text>
          <Flex column css={{ gap: '$md', mb: '$lg' }}>
            <Text h2>Did you get an Invite Code?</Text>
            <RedeemInviteCode />
          </Flex>
          <Text>
            Now the real adventure begins. Find links to others, make
            professional connections, make friends, have fun!
          </Text>
          <Button
            as={NavLink}
            to={coLinksPaths.explore}
            color="cta"
            size="large"
          >
            Explore CoLinks!
          </Button>
        </Flex>
      </WizardInstructions>
    </>
  );
};
