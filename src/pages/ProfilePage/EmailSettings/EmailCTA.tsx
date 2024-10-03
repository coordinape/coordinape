import { ComponentProps } from 'react';

import { connectButtonStyle } from 'features/github/ConnectGitHubButton';
import { useQuery } from 'react-query';

import { Mail } from 'icons/__generated';
import { Button } from 'ui';

import { getEmails } from './EditEmailForm';
import { EmailModal } from './EmailModal';

export const EmailCTA = ({
  color = 'primary',
  size = 'xs',
}: {
  color?: ComponentProps<typeof Button>['color'];
  size?: ComponentProps<typeof Button>['size'];
}) => {
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
        <EmailModal>
          <Button
            color={color}
            size={size}
            css={{
              ...connectButtonStyle,
              zIndex: 3,
              position: 'relative',
              width: '100%',
            }}
          >
            <Mail />
            {emails.length > 0 ? 'Verify' : 'Connect'} Your Email
          </Button>
        </EmailModal>
      )}
    </>
  );
};
