import { useQuery } from 'react-query';

import { Link, Text } from 'ui';

import { getEmails } from './EditEmailForm';
import { EmailModal } from './EmailModal';

export const EmailBanner = () => {
  const { data: emails } = useQuery('emails', async () => {
    return getEmails();
  });

  const verifiedEmails = emails?.filter(email => email.verified_at) || [];
  // If user has > 1 emails, but 0 verified, show banner
  const showBanner =
    !!emails && emails?.length > 0 && verifiedEmails.length === 0;

  return (
    <>
      {showBanner && (
        <Text
          tag
          color="warning"
          css={{
            borderRadius: 0,
            p: '$md',
          }}
        >
          <Text semibold>
            Stay up to date and get helpful app notifications
          </Text>
          <EmailModal>
            <Link inlineLink>Verify your email address</Link>
          </EmailModal>
        </Text>
      )}
    </>
  );
};
