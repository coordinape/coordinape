function getEnvValue<T extends string | number>(key: string, defaultVal: T): T {
  // Not available during initial loading
  if (!import.meta.env) return 'import.meta.env is undefined' as T;
  const v = import.meta.env[key];
  if (v) {
    return typeof defaultVal === 'number' ? (Number(v) as T) : (v as T);
  }
  console.warn(`Using default ENV variable: ${key}=${defaultVal}`);
  return defaultVal;
}

// since NODE_ENV is 'production' in both production & staging,
// we check a Vercel env var as well
// https://vercel.com/docs/concepts/projects/environment-variables

export const APP_MODE = getEnvValue<
  'production' | 'development' | 'preview' | 'missing-mode'
>('MODE', 'missing-mode');
export const IN_PRODUCTION = APP_MODE === 'production';
export const IN_PREVIEW = APP_MODE === 'preview';
export const IN_DEVELOPMENT = APP_MODE === 'development';
// TODO: Have prod remove the trailing slash
export const STORAGE_URL = getEnvValue(
  'VITE_S3_BASE_URL',
  'https://missing-s3-url'
).replace(/\/$/, '');

export const VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY = getEnvValue(
  'VITE_ALCHEMY_OPTIMISM_SEPOLIA_API_KEY',
  'missing-alchemy-optimism-sepolia-api-key'
);
export const VITE_ALCHEMY_OPTIMISM_API_KEY = getEnvValue(
  'VITE_ALCHEMY_OPTIMISM_API_KEY',
  'missing-alchemy-optimism-api-key'
);
export const VITE_ALCHEMY_ETH_MAINNET_API_KEY = getEnvValue(
  'VITE_ALCHEMY_ETH_MAINNET_API_KEY',
  'missing-alchemy-eth-mainnet-api-key'
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
