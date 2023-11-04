export const INVITE_CODE_COOKIE = 'cape_invite_code';

export function getInviteCodeCookieValue(cookieString: string): string | null {
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === INVITE_CODE_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  return null;
}
