import { useEffect, useState } from 'react';

import { WizardInstructions } from 'features/colinks/wizard/WizardInstructions';
import { fullScreenStyles } from 'features/colinks/wizard/WizardSteps';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../../components';
import { useAuthStateMachine } from '../../features/auth/RequireWeb3Auth';
import { coLinksPaths } from '../../routes/paths';
import { Button, Flex, Panel, Text } from '../../ui';

export const UnsubscribeEmailPage = () => {
  useAuthStateMachine(false);
  const { unsubscribeToken } = useParams();
  const navigate = useNavigate();

  const [unsubscribeMessage, setUnsubscribeMessage] = useState<
    string | undefined
  >();

  useEffect(() => {
    try {
      fetch('/api/email/unsubscribe/' + unsubscribeToken).then(res => {
        res.json().then(res => {
          setUnsubscribeMessage(res.message);
        });
      });
    } catch (e) {
      if (e instanceof Error) {
        setUnsubscribeMessage(e.message ?? 'unknown error');
      } else {
        setUnsubscribeMessage('Invalid token or network error');
      }
    }
  }, []);

  if (!unsubscribeMessage) {
    return <LoadingModal visible={true} note="unsubscribe-email" />;
  }

  return (
    <>
      <Flex css={{ flexGrow: 1, height: '100vh', width: '100vw' }}>
        <Flex column css={{ height: '100vh', width: '100%' }}>
          <WizardInstructions>
            <Flex column css={{ gap: '$md' }}>
              {unsubscribeMessage && (
                <>
                  <Text h2>You&lsquo;ve been unsubscribed</Text>
                  <Panel nested>
                    <Text>{unsubscribeMessage}</Text>
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

export default UnsubscribeEmailPage;
