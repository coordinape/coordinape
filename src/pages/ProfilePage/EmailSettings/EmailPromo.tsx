import { useQuery } from 'react-query';

import HintBanner from 'components/HintBanner';
import { Button, Text } from 'ui';

import { getEmails } from './EditEmailForm';
import { EmailModal } from './EmailModal';

export const EmailPromo = () => {
  const { data: emails } = useQuery('emails', async () => {
    return getEmails();
  });

  const verifiedEmails = emails?.filter(email => email.verified_at) || [];
  // If user has > 1 emails, but 0 verified, show banner

  const showCTA =
    !!emails && (emails.length === 0 || verifiedEmails.length === 0);

  return (
    <>
      {showCTA && (
        <HintBanner title={'Get Notifications'}>
          <Text p as="p" css={{ color: 'inherit' }}>
            Stay up to date and get helpful app notifications like when an Epoch
            is ending, reminders to add contributions and notes, and other
            updates.
          </Text>
          <EmailModal>
            <Button color="secondary">
              {emails.length > 0 ? 'Verify' : 'Connect'} Your Email
            </Button>
          </EmailModal>
        </HintBanner>
      )}
    </>
  );
};
