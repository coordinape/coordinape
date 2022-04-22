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

export const getAvatarPath = (avatar?: string, placeholder?: string) => {
  if (!avatar) return placeholder || AVATAR_PLACEHOLDER;

  // dont transform if its already a URL
  if (avatar.startsWith('https://')) {
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

export const getCircleAvatar = ({
  avatar,
  circleName,
}: {
  avatar?: string;
  circleName: string;
}) => {
  return avatar ? getAvatarPath(avatar) : getInitialsUrl(circleName);
};
