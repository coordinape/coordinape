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

import { fetchBasedGhouls } from '../_api/hasura/cron/fetchNFTOwners';
import {
  sendCoLinksNotificationsEmail,
} from '../api-lib/email/postmark';
// import { handleBonesGive } from '../api-lib/event_triggers/createColinksGiveEvent.ts';
import { backfillCastActivity } from '../api-lib/farcaster/backfillCastActivity.ts';
import { adminClient as client } from '../api-lib/gql/adminClient';
import { syncPoapDataForCoLinksUsers } from '../api-lib/poap/poap-api';
import { generateBonesGiveImg } from '../src/features/ai/replicate';
import { uploadURLToCloudflare } from '../src/features/cloudflare/uploadURLToCloudflare';
// uncomment and change this to import your own repl code

import { init as initOrgMembership } from './repl/org_membership';

//const syncCirclePGive = async (circleId: number) => {
//  return await genPgives(
//    [circleId],
//    DateTime.fromISO('2022-01-01'),
//    DateTime.now()
//  );
//};

const init = async () => {
  return {
    // add your init code here
    syncPoapDataForCoLinksUsers,
    sendCoLinksNotificationsEmail,
    backfillCastActivity,
    generateBonesGiveImg,
    // handleBonesGive,
    uploadURLToCloudflare,
    ghouls: fetchBasedGhouls,
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
