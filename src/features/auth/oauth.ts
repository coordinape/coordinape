import Cookies from 'js-cookie';

import { getAuthToken } from './token';

export const OAUTH_COOKIE_NAME = 'cape_at';
export const OAUTH_REDIRECT_COOKIE_NAME = 'cape_at_redirect_';

export const setOAuthCookie = (service: string) => {
  const authToken = getAuthToken(true);
  if (!authToken) {
    throw new Error(`Not logged in, can't connect ${service}`);
  }
  Cookies.set(OAUTH_COOKIE_NAME, authToken, { expires: 1 });
  return true;
};
export const setOAuthRedirectCookie = (service: string, page?: string) => {
  if (!page) {
    Cookies.remove(OAUTH_REDIRECT_COOKIE_NAME + service);
  } else {
    Cookies.set(OAUTH_REDIRECT_COOKIE_NAME + service, page, { expires: 1 });
  }
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

export function getOAuthRedirectCookieValue(
  cookieString: string,
  service: string
): string | null {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === OAUTH_REDIRECT_COOKIE_NAME + service) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
