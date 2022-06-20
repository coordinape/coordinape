import assert from 'assert';

import { STORAGE_URL } from 'config/env';

import { getIpfsUrl } from './selfIdHelpers';

// Including local-ape.host for hCaptcha, see the component.
export const DOMAIN_IS_PREVIEW = window.location.hostname.match(
  /(local-ape\.host|localhost|vercel\.app)$/
);

export const DOMAIN_IS_LOCALHOST = window.location.hostname.match(
  /(localhost|127.0.0.1)/
);

export const DOMAIN_IS_APP = window.location.host.split('.')[0] === 'app';

export const RENDER_APP =
  DOMAIN_IS_APP ||
  (DOMAIN_IS_PREVIEW && window.location.pathname !== '/landing');

export const APP_URL =
  DOMAIN_IS_APP || DOMAIN_IS_PREVIEW
    ? window.location.origin
    : window.location.origin.replace(
        window.location.host,
        `app.${window.location.host}`
      );

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
