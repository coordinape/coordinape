import { useToast } from '../../hooks';
import { Twitter } from '../../icons/__generated';
import { Button } from '../../ui';
import { setOAuthCookie } from '../auth/oauth';

export const ConnectTwitterButton = ({
  callbackPage,
}: {
  callbackPage?: string;
}) => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      setOAuthCookie('twitter');
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie()) {
      const url =
        '/api/twitter/login' + (callbackPage ? '?page=' + callbackPage : '');
      // eslint-disable-next-line no-console
      console.log('REDIREEEEEE', url);
      window.location.href = url;
    }
  };

  return (
    <Button onClick={connect}>
      <Twitter /> Connect Twitter
    </Button>
  );
};
