import { useToast } from '../../hooks';
import { Github } from '../../icons/__generated';
import { Button } from '../../ui';
import { setOAuthCookie } from '../auth/oauth';

const GITHUB_APP_URL = process.env.REACT_APP_GITHUB_APP_URL;

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
      window.location.href = GITHUB_APP_URL;
    }
  };

  return (
    <Button onClick={connect}>
      <Github /> Connect GitHub
    </Button>
  );
};
