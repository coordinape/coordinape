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
export const LOCAL_SEED_ADDRESS2: string = getEnvValue(
  'LOCAL_SEED_ADDRESS2',
  'missing'
);
export const TELEGRAM_BOT_BASE_URL = `https://api.telegram.org/bot${getEnvValue(
  'TELEGRAM_BOT_TOKEN',
  ''
)}`;

export const IS_LOCAL_ENV = process.env.NODE_ENV === 'development';

export const IS_TEST_ENV = ['development', 'test'].includes(
  process.env.NODE_ENV ?? ''
);

// intentionally don't use getEnv because this is optional
export const SENTRY_DSN = process.env.SENTRY_DSN;

export const HASURA_EVENT_SECRET: string = getEnvValue('HASURA_EVENT_SECRET');
export const COORDINAPE_USER_ADDRESS: string = getEnvValue(
  'COORDINAPE_USER_ADDRESS'
);

export const BE_ALCHEMY_API_KEY = getEnvValue(
  'BE_ALCHEMY_API_KEY',
  'missing-alchemy-backend-api-key'
);
export const HARDHAT_GANACHE_PORT: number = getEnvValue(
  'HARDHAT_GANACHE_PORT',
  8546
);

export const HARDHAT_PORT: number = getEnvValue('HARDHAT_PORT', 8545);

// This is only set to 'production' when deployed from main branch
export const VERCEL_ENV: string = getEnvValue('VERCEL_ENV', 'development');
export const IMAGE_DIR: string = getEnvValue('IMAGE_DIR', '');
export const MIXPANEL_PROJECT_TOKEN: string = getEnvValue(
  'MIXPANEL_PROJECT_TOKEN',
  ''
);

export const HASURA_DISCORD_SECRET: string = getEnvValue(
  'HASURA_DISCORD_SECRET',
  'no_secret'
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

export const COORDINAPE_BOT_SECRET: string = getEnvValue(
  'COORDINAPE_BOT_SECRET',
  'bot-secret'
);

export const COSOUL_SIGNER_ADDR_PK = getEnvValue(
  'COSOUL_SIGNER_ADDR_PK',
  // this is from the test mnemonic, priv key for acct 11
  '0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82'
);

export const BACKFILL_TO = getEnvValue('BACKFILL_TO', '');
export const PGIVE_CIRCLE_MAX_PER_CRON = getEnvValue(
  'PGIVE_CIRCLE_MAX_PER_CRON',
  10
);
export const TENDERLY_WEBHOOK_SECRET: string = getEnvValue(
  'TENDERLY_WEBHOOK_SECRET',
  ''
);

export const CHROMIUM_BINARY_LOCATION: string = getEnvValue(
  'CHROMIUM_BINARY_LOCATION',
  ''
);

export const POSTMARK_SERVER_TOKEN: string = getEnvValue(
  'POSTMARK_SERVER_TOKEN',
  ''
);
export const COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY: string = getEnvValue(
  'COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY',
  ''
);
export const LINK_TX_WEBHOOK_ALCHEMY_SIGNING_KEY: string = getEnvValue(
  'LINK_TX_WEBHOOK_ALCHEMY_SIGNING_KEY',
  ''
);
export const POAP_API_KEY: string = getEnvValue(
  'POAP_API_KEY',
  'default-poap-api-key'
);
export const HMAC_SECRET: string = getEnvValue(
  'HMAC_SECRET',
  'default-hmac-secret'
);
export const CLOUDFLARE_IMAGES_API_TOKEN: string = getEnvValue(
  'CLOUDFLARE_IMAGES_API_TOKEN',
  'cloudflare-token'
);
export const CLOUDFLARE_ACCOUNT_ID: string = getEnvValue(
  'CLOUDFLARE_ACCOUNT_ID',
  'cloudflare-account-id'
);
export const NEYNAR_API_KEY: string = getEnvValue(
  'NEYNAR_API_KEY',
  'no-neynar-api-key'
);
export const NEYNAR_BOT_SIGNER_UUID: string = getEnvValue(
  'NEYNAR_BOT_SIGNER_UUID',
  'neynar_bot_signer_uuid'
);
export const WARPCAST_GIVEBOT_AUTH: string = getEnvValue(
  'WARPCAST_GIVEBOT_AUTH',
  'warpcast_givebot_auth_default'
);
