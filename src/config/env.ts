function getEnvValue<T extends string | number>(key: string, defaultVal: T): T {
  const v = process.env[key];
  if (v) {
    return typeof defaultVal === 'number' ? (Number(v) as T) : (v as T);
  }
  console.warn(`Using default ENV variable: ${key}=${defaultVal}`);
  return defaultVal;
}

// since NODE_ENV is 'production' in both production & staging,
// we check a Vercel env var as well
// https://vercel.com/docs/concepts/projects/environment-variables
export const IN_PRODUCTION =
  process.env.NODE_ENV === 'production' &&
  process.env.REACT_APP_VERCEL_ENV !== 'preview';

// TODO: Have prod remove the trailing slash
export const STORAGE_URL = getEnvValue(
  'REACT_APP_S3_BASE_URL',
  'https://missing-s3-url'
).replace(/\/$/, '');
export const API_URL = getEnvValue(
  'REACT_APP_API_BASE_URL',
  'https://missing-laravel-url.edu'
);
// The test key always returns: 10000000-aaaa-bbbb-cccc-000000000001
export const CAPTCHA_SITE_KEY = IN_PRODUCTION
  ? getEnvValue('REACT_APP_H_CAPTCHA', 'missing-captcha-site-key')
  : '10000000-ffff-ffff-ffff-000000000001';
export const INFURA_PROJECT_ID = getEnvValue(
  'REACT_APP_INFURA_PROJECT_ID',
  'missing-infura-id'
);
export const REACT_APP_HASURA_URL = getEnvValue(
  'REACT_APP_HASURA_URL',
  'https://missing-hasura-url.edu'
);

if (!IN_PRODUCTION) {
  console.log(`Using GraphQL API URL: ${REACT_APP_HASURA_URL}`);
}

// Unused in practice
export const REACT_APP_FORTMATIC_API_KEY = 'unused'; // getEnvValue('REACT_APP_FORTMATIC_API_KEY', 'no-formatic-api-key');
export const REACT_APP_PORTIS_DAPP_ID = 'unused'; // getEnvValue('REACT_APP_PORTIS_DAPP_ID', 'no-portis-api-key');
