/* eslint-disable no-console */

/*
 * This script implements a Read-Eval-Print-Loop (REPL) script, which can be
 * useful for debugging and investigation. This can be used against a production
 * environment by running
 *
 * ❯ HASURA_GRAPHQL_ADMIN_SECRET=<ADMIN-SECRET> NODE_HASURA_URL=https://coordinape-prod.hasura.app/v1/graphql yarn repl
 */

import repl from 'repl';

import fp from 'lodash/fp';
import { DateTime } from 'luxon';

import { adminClient as client } from '../api-lib/gql/adminClient';
import { genPgives } from '../api-lib/pgives';
import { syncCoSouls } from '../api/hasura/cron/syncCoSouls';
import {
  getOnChainPGIVE,
  getTokenId,
  setOnChainPGIVE,
} from '../src/features/cosoul/api/cosoul';

// uncomment and change this to import your own repl code
import { init as initOrgMembership } from './repl/org_membership';

const syncCirclePGive = async (circleId: number) => {
  return await genPgives(
    [circleId],
    DateTime.fromISO('2022-01-01'),
    DateTime.now()
  );
};

const init = async () => {
  return {
    // add your init code here
    syncCirclePGive,
    setOnChainPGIVE,
    getTokenId,
    getOnChainPGIVE,
    syncCoSouls,
    ...(await initOrgMembership()),
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
