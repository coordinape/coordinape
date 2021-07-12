import { AUTO_OPEN_WALLET_DIALOG_PARAMS } from 'routes/paths';

export const DOMAIN_IS_LOCALHOST = window.location.hostname.endsWith(
  'localhost'
);
export const DOMAIN_IS_APP = window.location.host.split('.')[0] === 'app';

export const APP_URL = DOMAIN_IS_APP
  ? window.location.origin
  : window.location.origin.replace(
      window.location.host,
      `app.${window.location.host}`
    );

// TODO: Have prod remove the trailing slash
export const STORAGE_URL = (process.env
  .REACT_APP_S3_BASE_URL as string).replace(/\/$/, '');
export const API_URL = process.env.REACT_APP_API_BASE_URL as string;

export const getCirclePath = (circleId: number) => `${API_URL}/${circleId}`;
export const getCSVPath = (circleId: number, epochId: number) =>
  `${getCirclePath(circleId)}/csv?epoch_id=${epochId}`;
export const APP_URL_OPEN_WALLET = `${APP_URL}${AUTO_OPEN_WALLET_DIALOG_PARAMS}`;
export const AVATAR_PLACEHOLDER = '/imgs/avatar/placeholder.jpg';
export const getAvatarPath = (avatar?: string) =>
  avatar ? `${STORAGE_URL}/${avatar}` : AVATAR_PLACEHOLDER;
