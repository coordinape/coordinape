/* eslint-disable no-console */

import repl from 'repl';

import fp from 'lodash/fp';

import { adminClient as client } from '../api-lib/gql/adminClient';

const init = async () => {
  // add your init code here
  return {
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
