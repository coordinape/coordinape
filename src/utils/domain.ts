const regex1 = /^(\w+)\.\w+\.\w+$/;
const regex2 = /\/(\w+)\./;

export const isSubdomainAddress = () => {
  return regex1.test(window.location.hostname);
};

export const subdomainAddress = (subdomain: string) => {
  return isSubdomainAddress()
    ? window.location.origin.replace(regex2, `/${subdomain}.`)
    : `${window.location.protocol}//${subdomain}.${window.location.host}`;
};

export const rootdomainAddress = () => {
  return isSubdomainAddress()
    ? window.location.origin.replace(regex2, '/')
    : window.location.origin;
};

export const subdomain = () => {
  const matches = window.location.hostname.match(regex1) || [];
  const subdomain = matches.length > 1 ? matches[1] : '';
  return subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
};

export const apiBaseURL = () => {
  if (window.location.port === '3000') {
    return isSubdomainAddress()
      ? 'http://yearn.myvault.live/api'
      : 'http://myvault.live/api';
  }
  return isSubdomainAddress()
    ? `https://${subdomain()}.coordinape.me/api`
    : 'https://coordinape.me/api';
};
