import { useQuery } from 'react-query';

import isFeatureEnabled from 'config/features';
import { Button } from 'ui';

import { getEmails } from './EditEmailForm';
import { EmailModal } from './EmailModal';

export const EmailCTA = () => {
  const { data: emails } = useQuery('emails', async () => {
    return getEmails();
  });

  const verifiedEmails = emails?.filter(email => email.verified_at) || [];
  // If user has > 1 emails, but 0 verified, show banner

  const showCTA =
    !!emails && (emails.length === 0 || verifiedEmails.length === 0);

  return (
    <>
      {isFeatureEnabled('email') && (
        <>
          {showCTA && (
            <EmailModal>
              <Button
                color="primary"
                size="xs"
                css={{
                  zIndex: 3,
                  position: 'relative',
                  width: '100%',
                }}
              >
                {emails.length > 0 ? 'Verify' : 'Connect'} Your Email
              </Button>
            </EmailModal>
          )}
        </>
      )}
    </>
  );
};
