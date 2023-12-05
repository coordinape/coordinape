import { ShowOrConnectGitHub } from 'features/github/ShowOrConnectGitHub';
import { ShowOrConnectLinkedIn } from 'features/linkedin/ShowOrConnectLinkedIn';
import { ShowOrConnectTwitter } from 'features/twitter/ShowOrConnectTwitter';

import { EmailCTA } from 'pages/ProfilePage/EmailSettings/EmailCTA';
import { coLinksPaths } from 'routes/paths';
import { Flex, Panel, Text } from 'ui';

import { SkipButton } from './SkipButton';
import { WizardInstructions } from './WizardInstructions';
import { fullScreenStyles } from './WizardSteps';

export const WizardRep = ({
  skipStep,
  repScore,
}: {
  skipStep: () => void;
  repScore: number | undefined;
}) => {
  return (
    <>
      <Flex
        css={{
          ...fullScreenStyles,
          background:
            'radial-gradient(circle, #1F1518 20%, #B85252 58%, #FEEDC1 82%, #4B2E35 100%)',
        }}
      />
      <Flex
        column
        css={{
          ...fullScreenStyles,
          backgroundImage: "url('/imgs/background/colink-rep.jpg')",
          backgroundPosition: '50% 45%',
        }}
      />
      <WizardInstructions>
        <Text h2>Build Rep by connecting to other realms</Text>
        <Text>
          Establish your repulation by linking other channels like LinkedIn,
          Twitter, or your email address.
        </Text>
        <Flex
          column
          css={{
            gap: '$md',
            my: '$md',
            alignItems: 'flex-start',
            button: {
              minWidth: '13em',
            },
          }}
        >
          <ShowOrConnectTwitter
            minimal={true}
            callbackPage={coLinksPaths.wizard}
          />
          <ShowOrConnectGitHub
            minimal={true}
            callbackPage={coLinksPaths.wizard}
          />
          <ShowOrConnectLinkedIn
            minimal={true}
            callbackPage={coLinksPaths.wizard}
          />
          <EmailCTA size="medium" />
        </Flex>
        <Panel
          nested
          css={{
            gap: '$sm',
            mt: '$md',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <Flex css={{ gap: '$sm' }}>
            <Text semibold size="small">
              Initial Rep Score
            </Text>
            <Text h2>{repScore ?? '0'}</Text>
          </Flex>
        </Panel>
        <SkipButton onClick={skipStep} />
      </WizardInstructions>
    </>
  );
};
