import assert from 'assert';

import { STORAGE_URL } from 'config/env';

import { getIpfsUrl } from './selfIdHelpers';

function hostname(): string {
  if (typeof window !== 'undefined') {
    // this will always be true until we move to nextjs
    return window.location.hostname;
  }
  // TODONEXT: if this matters and remains, we would use useRouter here -g
  return 'server-side-fixme';
}

function hostAndPort(): string {
  if (typeof window !== 'undefined') {
    // this will always be true until we move to nextjs
    return window.location.host;
  }
  // TODONEXT: if this matters and remains, we would use useRouter here -g
  return 'server-side-fixme';
}

function pathname(): string {
  if (typeof window !== 'undefined') {
    // this will always be true until we move to nextjs
    return window.location.pathname;
  }
  // TODONEXT: if this matters and remains, we would use useRouter here -g
  return '/fixme';
}

function origin(): string {
  if (typeof window !== 'undefined') {
    // this will always be true until we move to nextjs
    return window.location.origin;
  }
  // TODONEXT: if this matters and remains, we would use useRouter here -g
  return 'fixme-origin';
}

// Including local-ape.host for hCaptcha, see the component.
export const DOMAIN_IS_PREVIEW = hostname().match(
  /(local-ape\.host|localhost|vercel\.app)$/
);

export const DOMAIN_IS_LOCALHOST = hostname().match(/(localhost|127.0.0.1)/);

export const DOMAIN_IS_APP = hostAndPort().split('.')[0] === 'app';

export const RENDER_APP =
  DOMAIN_IS_APP || (DOMAIN_IS_PREVIEW && pathname() !== '/landing');

const APP_URL =
  DOMAIN_IS_APP || DOMAIN_IS_PREVIEW
    ? origin()
    : origin().replace(hostAndPort(), `app.${hostAndPort()}`);

export const AUTO_OPEN_WALLET_DIALOG_PARAMS = '?open-wallet';
export const APP_URL_OPEN_WALLET = `${APP_URL}${AUTO_OPEN_WALLET_DIALOG_PARAMS}`;
export const APP_PATH_CREATE_CIRCLE = `/new-circle`;
export const APP_URL_CREATE_CIRCLE = `${APP_URL}${APP_PATH_CREATE_CIRCLE}`;
export const AVATAR_PLACEHOLDER = '/imgs/avatar/placeholder.jpg';

const getInitialsUrl = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};

export const getAvatarPath = (
  avatar?: string,
  placeholder?: string
): string => {
  let path;
  if (avatar) {
    path = getAvatarPathWithoutPlaceholder(avatar);
    assert(path);
  } else {
    path = placeholder || AVATAR_PLACEHOLDER;
  }
  return path;
};

export const getAvatarPathWithoutPlaceholder = (avatar?: string) => {
  if (!avatar) return;

  // dont transform if its already a URL
  if (avatar.startsWith('https://')) {
    return avatar;
  }

  if (avatar.startsWith('http://')) {
    return avatar;
  }

  if (avatar.startsWith('blob')) {
    return avatar;
  }

  if (avatar.startsWith('ipfs://')) {
    return getIpfsUrl(avatar);
  }

  return `${STORAGE_URL}/${avatar}`;
};

export const getAvatarPathWithFallback = (avatar?: string, name?: string) => {
  const placeholder = name ? getInitialsUrl(name) : AVATAR_PLACEHOLDER;

  return avatar ? getAvatarPath(avatar) : placeholder;
};

export const getInitialFromName = (name: string) => {
  const hasSpace = name.indexOf(' ') !== -1;
  const initials =
    name.substring(0, hasSpace ? 1 : 2) +
    (hasSpace ? name.charAt(name.lastIndexOf(' ') + 1) : '').toUpperCase();
  return initials.toUpperCase();
  // Returns PE if name is "Peter Edwards"
  // Returns PR if name is "Peter Edwards Roman"
  // Returns PR if name is "Preben"
};

export const getCircleAvatar = ({
  avatar,
  circleName,
}: {
  avatar?: string;
  circleName: string;
}) => {
  return avatar ? getAvatarPath(avatar) : getInitialsUrl(circleName);
};
