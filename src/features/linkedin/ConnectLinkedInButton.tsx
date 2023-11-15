import { LinkedInLogoIcon } from '@radix-ui/react-icons';

import { useToast } from '../../hooks';
import { Button } from '../../ui';
import { setOAuthCookie, setOAuthRedirectCookie } from '../auth/oauth';

export const ConnectLinkedInButton = ({
  callbackPage,
}: {
  callbackPage?: string;
}) => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      setOAuthCookie('linkedin');
      setOAuthRedirectCookie('linkedin', callbackPage);
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie()) {
      window.location.href = '/api/linkedin/login';
    }
  };

  return (
    <Button onClick={connect}>
      <LinkedInLogoIcon /> Connect LinkedIn
    </Button>
  );
};
