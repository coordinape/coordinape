import { useToast } from '../../hooks';
import { Twitter } from '../../icons/__generated';
import { Button } from '../../ui';
import { setOAuthCookie, setOAuthRedirectCookie } from '../auth/oauth';

export const ConnectTwitterButton = ({
  callbackPage,
}: {
  callbackPage?: string;
}) => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      setOAuthCookie('twitter');
      setOAuthRedirectCookie('twitter', callbackPage);
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie()) {
      const url = '/api/twitter/login';
      window.location.href = url;
    }
  };

  return (
    <Button onClick={connect}>
      <Twitter /> Connect Twitter
    </Button>
  );
};
