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

export const HASURA_ADMIN_SECRET = <string>getEnvValue('HASURA_ADMIN_SECRET');
export const HASURA_URL = <string>getEnvValue('HASURA_URL');
export const IS_LOCAL_ENV = process.env.NODE_ENV === 'development';
