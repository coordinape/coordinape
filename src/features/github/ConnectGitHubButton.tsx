import { useToast } from '../../hooks';
import { Github } from '../../icons/__generated';
import { Button } from '../../ui';
import { setOAuthCookie, setOAuthRedirectCookie } from '../auth/oauth';

export const connectButtonStyle = {
  minWidth: '12.5rem',
};

export const ConnectGitHubButton = ({
  callbackPage,
}: {
  callbackPage?: string;
}) => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      setOAuthCookie('github');
      setOAuthRedirectCookie('github', callbackPage);
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie()) {
      window.location.href = '/api/github/login';
    }
  };

  return (
    <Button onClick={connect} css={{ ...connectButtonStyle }}>
      <Github nostroke /> Connect GitHub
    </Button>
  );
};
