// dotenv is needed for `./scripts/*`
// for the api/*, perhaps conditionally disable
// Long term, refactor for monorepo
import dotenv from 'dotenv';
dotenv.config();

function getEnvValue<T extends string | number>(
  key: string,
  defaultVal?: T
): T {
  const v = process.env[key];
  if (v) {
    return typeof defaultVal === 'number' ? (Number(v) as T) : (v as T);
  }
  if (defaultVal === undefined) {
    if (process.env.CI) return 'missing in CI' as T;

    throw new Error(`Missing env variable: ${key}`);
  }
  return defaultVal;
}

// TODO: Refactor the GQL libs in a way that works as a package
// and can be used by, script, serverless functions and react.
// There shouldn't be a fallback if we consider vercel as requiring these.
export const HASURA_GRAPHQL_ADMIN_SECRET: string = getEnvValue(
  'HASURA_GRAPHQL_ADMIN_SECRET'
);
export const NODE_HASURA_URL: string = getEnvValue(
  'NODE_HASURA_URL',
  'missing'
);
export const LOCAL_SEED_ADDRESS: string = getEnvValue(
  'LOCAL_SEED_ADDRESS',
  'missing'
);
export const TELEGRAM_BOT_BASE_URL = `https://api.telegram.org/bot${getEnvValue(
  'TELEGRAM_BOT_TOKEN',
  ''
)}`;
export const IS_LOCAL_ENV = process.env.NODE_ENV === 'development';

export const IS_TEST_ENV = process.env.NODE_ENV === 'development' || 'test';

// intentionally don't use getEnv because this is optional
export const SENTRY_DSN = process.env.SENTRY_DSN;

export const HASURA_EVENT_SECRET: string = getEnvValue('HASURA_EVENT_SECRET');
export const COORDINAPE_USER_ADDRESS: string = getEnvValue(
  'COORDINAPE_USER_ADDRESS'
);

export const INFURA_PROJECT_ID = getEnvValue(
  'REACT_APP_INFURA_PROJECT_ID',
  'missing-infura-id'
);

export const HARDHAT_GANACHE_PORT: number = getEnvValue(
  'HARDHAT_GANACHE_PORT',
  8546
);

export const ETHEREUM_RPC_URL: string = getEnvValue('ETHEREUM_RPC_URL');

export const GOERLI_RPC_URL: string = getEnvValue('GOERLI_RPC_URL');

// This is only set to 'production' when deployed from main branch
export const VERCEL_ENV: string = getEnvValue('VERCEL_ENV', 'development');
export const IMAGE_DIR: string = getEnvValue('IMAGE_DIR', '');
export const MIXPANEL_PROJECT_TOKEN: string = getEnvValue(
  'MIXPANEL_PROJECT_TOKEN',
  ''
);

export const DISCORD_BOT_CLIENT_ID: string = getEnvValue(
  'DISCORD_BOT_CLIENT_ID',
  'no_token'
);
export const DISCORD_BOT_CLIENT_SECRET: string = getEnvValue(
  'DISCORD_BOT_CLIENT_SECRET',
  'no_token'
);
export const DISCORD_BOT_REDIRECT_URI: string = getEnvValue(
  'DISCORD_BOT_REDIRECT_URI',
  'http://localhost:3000/discord/link'
);
