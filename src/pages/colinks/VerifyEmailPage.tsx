import { useEffect, useState } from 'react';

import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../../components';
import { useAuthStateMachine } from '../../features/auth/RequireAuth';
import { coLinksPaths } from '../../routes/paths';
import { Button, Flex, Panel, Text } from '../../ui';

export const VerifyEmailPage = () => {
  useAuthStateMachine(false);
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [verifyMessage, setVerifyMessage] = useState<string | undefined>();

  useEffect(() => {
    try {
      fetch('/api/email/verify/' + uuid).then(res => {
        res.json().then(res => {
          setVerifyMessage(res.message);
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        setVerifyMessage(e.message ?? 'unknown error');
      } else {
        setVerifyMessage('Invalid uuid or network error');
      }
    }
  }, []);

  if (!verifyMessage) {
    return <LoadingModal visible={true} note="verifying-email" />;
  }

  return (
    <>
      <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
        <Flex column css={{ height: '100vh', width: '100%' }}>
          <WizardInstructions>
            <Flex column css={{ gap: '$md' }}>
              {verifyMessage && (
                <>
                  <Text h2>Email Verification</Text>
                  <Panel nested>
                    <Text>{verifyMessage}</Text>
                  </Panel>
                  <Button
                    color="cta"
                    onClick={() => {
                      navigate(coLinksPaths.home, {
                        replace: true,
                      });
                    }}
                  >
                    Continue to CoLinks
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => {
                      navigate(coLinksPaths.account, {
                        replace: true,
                      });
                    }}
                  >
                    View Email Settings
                  </Button>
                </>
              )}
            </Flex>
          </WizardInstructions>
        </Flex>
        <Flex
          css={{
            ...fullScreenStyles,
            background:
              'radial-gradient(circle, rgb(18 19 21) 0%, #BC5B31 58%, #FDE9C4 83%, #462A2C 100%)',
          }}
        />
        <Flex
          css={{
            ...fullScreenStyles,
            animationDirection: 'alternate',
            backgroundImage: "url('/imgs/background/colink-verification.jpg')",
            backgroundPosition: '50% 20% ',
          }}
        />
      </Flex>
    </>
  );
};

export default VerifyEmailPage;
