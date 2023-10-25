/* eslint-disable no-console */

/*
 * This script implements a Read-Eval-Print-Loop (REPL) script, which can be
 * useful for debugging and investigation. This one is focused on AI experimentation.
 */

import repl from 'repl';

import fp from 'lodash/fp';

import { adminClient as client } from '../api-lib/gql/adminClient';
import { generateEmbeddings } from '../api-lib/poap/generate-embeddings';
import {
  fetchPoapDataForTopCosouls,
  syncPoapDataForAddress,
  getEventsForAddress,
} from '../api-lib/poap/poap-api';

const init = async () => {
  return {
    // add your init code here
    syncPoapDataForAddress,
    fetchPoapDataForTopCosouls,
    getEventsForAddress,
    generateEmbeddings,
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
