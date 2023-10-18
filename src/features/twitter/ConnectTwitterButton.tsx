import Cookies from 'js-cookie';

import { useToast } from '../../hooks';
import { Button } from '../../ui';
import { getAuthToken } from '../auth';

import { TWITTER_AUTH_COOKIE_NAME } from './cookie';

export const ConnectTwitterButton = () => {
  const { showError } = useToast();

  const setAuthCookie = () => {
    try {
      const authToken = getAuthToken(true);
      if (!authToken) {
        throw new Error(`Not logged in, can't connect twitter`);
      }
      Cookies.set(TWITTER_AUTH_COOKIE_NAME, authToken, { expires: 1 });
    } catch (e: any) {
      showError(e);
      return false;
    }
    return true;
  };

  const connect = () => {
    if (setAuthCookie()) {
      window.location.href = '/api/twitter/login';
    }
  };

  return <Button onClick={connect}>Connect Twitter</Button>;
};
