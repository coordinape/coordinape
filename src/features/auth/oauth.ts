import Cookies from 'js-cookie';

import { getAuthToken } from './token';

export const OAUTH_COOKIE_NAME = 'cape_at';

export const setOAuthCookie = (service: string) => {
  const authToken = getAuthToken(true);
  if (!authToken) {
    throw new Error(`Not logged in, can't connect ${service}`);
  }
  Cookies.set(OAUTH_COOKIE_NAME, authToken, { expires: 1 });
  return true;
};

export function getOAuthCookieValue(cookieString: string): string | null {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === OAUTH_COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
