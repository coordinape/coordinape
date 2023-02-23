/* eslint-disable no-console */

/*
 * This script implements a Read-Eval-Print-Loop (REPL) script, which can be useful for debugging and investigation.
 * This can be used against a production environment by running
 *
 * ❯ HASURA_GRAPHQL_ADMIN_SECRET=<ADMIN-SECRET> NODE_HASURA_URL=https://coordinape-prod.hasura.app/v1/graphql yarn repl
 */

import repl from 'repl';

import fp from 'lodash/fp';

import { adminClient as client } from '../api-lib/gql/adminClient';

// TODO: uncmoment and change this to import your repl code
// import { init as initNameRepair } from './repl/name_repair';

const init = async () => {
  // add your init code here
  return {
    // TODO: uncomment and initialize your repl helper functions
    // ...(await initNameRepair()),
  };
};

const main = async () => {
  console.log(`Initializing REPL for ${process.env.NODE_HASURA_URL}...`);
  const context = await init();
  const r = repl.start('> ');

  Object.assign(r.context, {
    ...context,
    client,
    fp,
    reload: async () => {
      Object.assign(r.context, await init());
    },
  });

  r.on('exit', () => {
    console.log('Goodbye!');
    process.exit();
  });
};

main();
