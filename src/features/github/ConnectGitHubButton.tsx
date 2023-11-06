import { useToast } from '../../hooks';
import { Github } from '../../icons/__generated';
import { Button } from '../../ui';
import { setOAuthCookie } from '../auth/oauth';

export const ConnectGitHubButton = () => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      setOAuthCookie('github');
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie() && !!GITHUB_APP_URL) {
      window.location.href = '/api/github/login';
    }
  };

  return (
    <Button onClick={connect}>
      <Github /> Connect GitHub
    </Button>
  );
};
