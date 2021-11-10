import {
  AUTO_OPEN_WALLET_DIALOG_PARAMS,
  getCreateCirclePath,
} from 'routes/paths';

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
  (DOMAIN_IS_PREVIEW && !window.location.href.match('/landing'));

export const APP_URL =
  DOMAIN_IS_APP || DOMAIN_IS_PREVIEW
    ? window.location.origin
    : window.location.origin.replace(
        window.location.host,
        `app.${window.location.host}`
      );

// TODO: Have prod remove the trailing slash
export const STORAGE_URL = (
  process.env.REACT_APP_S3_BASE_URL as string
).replace(/\/$/, '');
export const API_URL = process.env.REACT_APP_API_BASE_URL as string;

// since NODE_ENV is 'production' in both production & staging,
// we check a Vercel env var as well
// https://vercel.com/docs/concepts/projects/environment-variables
export const IN_PRODUCTION =
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_VERCEL_ENV !== 'preview';

export const getCirclePath = (circleId: number) => `${API_URL}/${circleId}`;
export const getCSVPath = (circleId: number, epochId: number) =>
  `${getCirclePath(circleId)}/csv?epoch_id=${epochId}`;
export const APP_URL_OPEN_WALLET = `${APP_URL}${AUTO_OPEN_WALLET_DIALOG_PARAMS}`;
export const APP_URL_CREATE_CIRCLE = `${APP_URL}${getCreateCirclePath()}`;
export const AVATAR_PLACEHOLDER = '/imgs/avatar/placeholder.jpg';

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

export const getAvatarPathWithInitialsFallback = (
  avatar?: string,
  name?: string
) => {
  const placeholder = name
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(name ?? '')}`
    : AVATAR_PLACEHOLDER;

  return avatar ? getAvatarPath(avatar) : placeholder;
};
