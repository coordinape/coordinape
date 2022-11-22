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

export const IN_DEVELOPMENT =
  process.env.NODE_ENV === 'development' ||
  process.env.REACT_APP_VERCEL_ENV !== 'production';

// TODO: Have prod remove the trailing slash
export const STORAGE_URL = getEnvValue(
  'REACT_APP_S3_BASE_URL',
  'https://missing-s3-url'
).replace(/\/$/, '');

export const INFURA_PROJECT_ID = getEnvValue(
  'REACT_APP_INFURA_PROJECT_ID',
  'missing-infura-id'
);
export const REACT_APP_HASURA_URL = getEnvValue(
  'REACT_APP_HASURA_URL',
  'https://missing-hasura-url.edu'
);

export const HARDHAT_CHAIN_ID: number = +(process.env.HARDHAT_CHAIN_ID || 1337);
export const HARDHAT_PORT: number = +(process.env.HARDHAT_PORT || 8545);
export const HARDHAT_GANACHE_CHAIN_ID: number = +(
  process.env.HARDHAT_GANACHE_CHAIN_ID || 1338
);
export const HARDHAT_GANACHE_PORT: number = +(
  process.env.HARDHAT_GANACHE_PORT || 8546
);
