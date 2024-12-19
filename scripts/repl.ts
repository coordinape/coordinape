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
import { genGiveImage } from '../api-lib/event_triggers/createColinksGiveEvent.ts';
import { backfillCastActivity } from '../api-lib/farcaster/backfillCastActivity.ts';
import { order_by } from '../api-lib/gql/__generated__/zeus/index.ts';
import { adminClient, adminClient as client } from '../api-lib/gql/adminClient';
import { syncPoapDataForCoLinksUsers } from '../api-lib/poap/poap-api';
import { uploadURLToCloudflare } from '../src/features/cloudflare/uploadURLToCloudflare';
// uncomment and change this to import your own repl code

const regenGiveImages = async () => {
  const { colinks_gives } = await adminClient.query(
    {
      colinks_gives: [
        { order_by: { created_at: order_by.desc_nulls_last }, limit: 10 },
        {
          id: true,
        },
      ],
    },
    { operationName: 'getGives' }
  );

  for (const give of colinks_gives) {
    await genGiveImage(give.id);
  }

};

import { TOKENS } from '../src/features/points/getAvailablePoints.ts';

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
    TOKENS,
    syncPoapDataForCoLinksUsers,
    sendCoLinksNotificationsEmail,
    backfillCastActivity,
    // handleBonesGive,
    uploadURLToCloudflare,
    ghouls: fetchBasedGhouls,
    regenGiveImages,
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
