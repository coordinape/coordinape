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

import { syncCoSouls } from '../_api/hasura/cron/syncCoSouls';
import { updateProfileNFTs } from '../_api/nfts/alchemy';
import {
  sendCoLinksNotificationsEmail,
  sendEpochEndedEmail,
  sendEpochEndingSoonEmail,
  sendEpochStartedEmail,
} from '../api-lib/email/postmark';
import { backfillCastActivity } from '../api-lib/farcaster/backfillCastActivity.ts';
import { adminClient as client } from '../api-lib/gql/adminClient';
import { generateWarpCastUrl, publishCast } from '../api-lib/neynar';
import { genPgives } from '../api-lib/pgives';
import { syncPoapDataForCoLinksUsers } from '../api-lib/poap/poap-api';
import {
  getOnChainPGive,
  getTokenId,
  setOnChainPGive,
} from '../src/features/cosoul/api/cosoul';
// uncomment and change this to import your own repl code
import { getLocalPGIVE } from '../src/features/cosoul/api/pgive.ts';
import { storeCoSoulImage } from '../src/features/cosoul/art/screenshot';

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
    publishCast,
    setOnChainPGive,
    getTokenId,
    getOnChainPGive,
    syncCoSouls,
    storeCoSoulImage,
    sendEpochEndedEmail,
    sendEpochStartedEmail,
    sendEpochEndingSoonEmail,
    // generateRandomMnemonics,
    syncPoapDataForCoLinksUsers,
    sendCoLinksNotificationsEmail,
    getLocalPGIVE,
    generateWarpCastUrl,
    backfillCastActivity,
    nft: updateProfileNFTs,
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
