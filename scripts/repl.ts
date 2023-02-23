/* eslint-disable no-console */

import repl from 'repl';

import fp from 'lodash/fp';

import { adminClient as client } from '../api-lib/gql/adminClient';

// import { init as initNameRepair } from './repl/name_repair';

const init = async () => {
  // add your init code here
  return {
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
