import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import { LoadingModal } from '../../components';
import { useAuthStateMachine } from '../../features/auth/RequireAuth';
import { coLinksPaths } from '../../routes/paths';
import { Button, CenteredBox, Panel, Text } from '../../ui';

export const VerifyWaitListEmailPage = () => {
  useAuthStateMachine(false);
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [verifyMessage, setVerifyMessage] = useState<string | undefined>();

  useEffect(() => {
    try {
      fetch('/api/email/verifywaitlist/' + uuid).then(res => {
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
      {verifyMessage && (
        <CenteredBox css={{ gap: '$md' }}>
          <Text h2 css={{ justifyContent: 'center' }}>
            Email Verification
          </Text>
          <Panel nested>
            <Text>{verifyMessage}</Text>
          </Panel>
          <Panel nested>Ok you are in! Now what?</Panel>
          <Button
            onClick={() => {
              navigate(coLinksPaths.wizard, {
                replace: true,
              });
            }}
          >
            Improve your Rep Score
          </Button>
        </CenteredBox>
      )}
    </>
  );
};

export default VerifyWaitListEmailPage;
