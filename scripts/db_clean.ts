import assert from 'assert';

import fetch from 'node-fetch';

const { NODE_HASURA_URL: URL, HASURA_GRAPHQL_ADMIN_SECRET: SECRET } =
  process.env;

assert(URL, 'missing NODE_HASURA_URL in env');
assert(SECRET, 'missing HASURA_GRAPHQL_ADMIN_SECRET in env');

const clearSchema = (schema: string) => {
  const sql = `DO $$ BEGIN
  EXECUTE (SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
    FROM pg_class 
    WHERE relkind = 'r' 
    AND relnamespace = '${schema}'::regnamespace
    AND oid::regclass::text != 'vault_tx_types');
  END$$`;

  return fetch(URL.replace('v1/graphql', 'v2/query'), {
    method: 'POST',
    body: JSON.stringify({
      type: 'run_sql',
      args: { source: 'default', sql },
    }),
    headers: {
      'X-Hasura-Role': 'admin',
      'x-hasura-admin-secret': SECRET,
    },
  });
};

clearSchema('discord')
  .then(() => clearSchema('public'))
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .then(() => {
    process.exit(0);
  });
