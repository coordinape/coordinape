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
    throw new Error(`Missing env variable: ${key}`);
  }
  return defaultVal;
}

// TODO: Refactor the GQL libs in a way that works as a package
// and can be used by, script, serverless functions and react.
// There shouldn't be a fallback if we consider vercel as requiring these.
export const HASURA_GRAPHQL_ADMIN_SECRET = <string>(
    getEnvValue('HASURA_GRAPHQL_ADMIN_SECRET')
);
export const NODE_HASURA_URL = <string>(
    getEnvValue('NODE_HASURA_URL', 'missing')
);
export const LOCAL_SEED_ADDRESS = <string>(
    getEnvValue('LOCAL_SEED_ADDRESS', 'missing')
);
export const IS_LOCAL_ENV = process.env.NODE_ENV === 'development';

export const HASURA_EVENT_SECRET = <string>getEnvValue('HASURA_EVENT_SECRET');
export const COORDINAPE_USER_ADDRESS = <string>(
    getEnvValue('COORDINAPE_USER_ADDRESS', '')
);
