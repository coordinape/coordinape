import { useQuery } from 'react-query';

import useConnectedAddress from 'hooks/useConnectedAddress';
import { Link, Text } from 'ui';

import { getEmails } from './EditEmailForm';
import { EmailModal } from './EmailModal';

export const EmailBanner = () => {
  const account = useConnectedAddress(false);

  const { data: emails } = useQuery(
    'emails',
    async () => {
      return getEmails();
    },
    {
      enabled: !!account,
    }
  );

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
          <Text semibold>Your email is still awaiting verification.</Text>
          <EmailModal>
            <Link inlineLink>Verify your email address</Link>
          </EmailModal>
        </Text>
      )}
    </>
  );
};
