import { ICircle } from 'types';

export const apiBaseURL = () => {
  if (window.location.port === '3000') {
    return 'http://myvault.live/api';
  }
  return 'https://coordinape.me/api';
};

export const apiBaseURLofCircle = (circle: ICircle) => {
  if (window.location.port === '3000') {
    return `http://myvault.live/api/${circle.id}`;
  }
  return `https://coordinape.me/api/${circle.id}`;
};

export const DOMAIN_IS_APP = window.location.host.split('.')[0] === 'app';

export const getAppUrl = () =>
  DOMAIN_IS_APP
    ? window.location.origin
    : window.location.origin.replace(
        window.location.host,
        `app.${window.location.host}`
      );
