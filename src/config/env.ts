function getEnvValue<T extends string | number>(key: string, defaultVal: T): T {
  // Not available during initial loading
  if (!import.meta.env) {
    if (process.env) {
      const v = process.env[key];
      if (v) {
        return typeof defaultVal === 'number' ? (Number(v) as T) : (v as T);
      }
    } else {
      throw new Error('import.meta is not defined, nor is process.env');
    }
  } else {
    const v = import.meta.env[key];
    if (v) {
      return typeof defaultVal === 'number' ? (Number(v) as T) : (v as T);
    }
    console.warn(`Using default ENV variable: ${key}=${defaultVal}`);
  }
  return defaultVal;
}

// since NODE_ENV is 'production' in both production & staging,
// we check a Vercel env var as well
// https://vercel.com/docs/concepts/projects/environment-variables

export const APP_MODE_VITE = getEnvValue<
  'production' | 'development' | 'preview' | 'missing-mode'
>('VITE_VERCEL_ENV', 'missing-mode');

export const APP_MODE =
  APP_MODE_VITE !== 'missing-mode'
    ? APP_MODE_VITE
    : getEnvValue<'production' | 'development' | 'preview' | 'missing-mode'>(
        'VERCEL_ENV',
        'development'
      );

export const NODE_ENV = getEnvValue<'unknown' | 'test'>('NODE_ENV', 'unknown');

export const IN_PRODUCTION = APP_MODE === 'production';
export const IN_PREVIEW = APP_MODE === 'preview';
export const IN_DEVELOPMENT = APP_MODE === 'development';
export const IN_TEST = NODE_ENV === 'test';

export const BRANCH_URL =
  getEnvValue<string>('VITE_VERCEL_BRANCH_URL', '') ||
  getEnvValue<string>('VERCEL_BRANCH_URL', '');

export const MAGIC_API_KEY = getEnvValue<string>(
  'VITE_MAGIC_API_KEY',
  'missing-magic'
);
// // eslint-disable-next-line no-console
// console.log(
//   'APP_MODE',
//   APP_MODE,
//   'APP_MODE_VITE',
//   APP_MODE_VITE,
//   'IN_PREVIEW',
//   IN_PREVIEW,
//   'IN_PRODUCTION',
//   IN_PRODUCTION,
//   'IN_DEVELOPMENT',
//   IN_DEVELOPMENT
// );

// TODO: Have prod remove the trailing slash
export const STORAGE_URL = getEnvValue(
  'VITE_S3_BASE_URL',
  'https://missing-s3-url'
).replace(/\/$/, '');

export const VITE_FE_ALCHEMY_API_KEY = getEnvValue(
  'VITE_FE_ALCHEMY_API_KEY',
  'missing-alchemy-fe-api-key'
);
export const DECENT_XYZ_API_KEY = getEnvValue(
  'VITE_DECENT_XYZ_API_KEY',
  'missing VITE_DECENT_XYZ_API_KEY'
);
// eslint-disable-next-line no-console
export const VITE_HASURA_URL = getEnvValue(
  'VITE_HASURA_URL',
  'missing VITE_HASURA_URL'
);
export const HARDHAT_CHAIN_ID: number = +(process.env.HARDHAT_CHAIN_ID || 1337);
export const HARDHAT_PORT: number = +(process.env.HARDHAT_PORT || 8545);
export const HARDHAT_GANACHE_CHAIN_ID: number = +(
  process.env.HARDHAT_GANACHE_CHAIN_ID || 1338
);
export const HARDHAT_GANACHE_PORT: number = +(
  process.env.HARDHAT_GANACHE_PORT || 8546
);

export const WALLET_CONNECT_V2_PROJECT_ID = getEnvValue(
  'VITE_WALLET_CONNECT_V2_PROJECT_ID',
  'missing-wallet-connect-v2-project-id'
);
