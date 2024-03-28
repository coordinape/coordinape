vi.mock('puppeteer-core', () => {
  return { default: {} };
});
/* eslint-disable no-console */
import assert from 'assert';

import type { CoSoul } from '@coordinape/contracts/typechain';
import type { VercelRequest } from '@vercel/node';
import { vi } from 'vitest';

import handler, * as syncCosouls from '../../../_api/hasura/cron/syncCoSouls';
import {
  cosouls_constraint,
  cosouls_update_column,
} from '../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  getOnChainPGIVE,
  getTokenId,
} from '../../../src/features/cosoul/api/cosoul';
import { Contracts } from '../../../src/features/cosoul/contracts';
import {
  provider,
  restoreSnapshot,
  takeSnapshot,
} from '../../../src/utils/testing/provider';
import { createProfile, createUser } from '../../helpers';

let contract: CoSoul;
let snapshotId: string;
let mainAccount: string;
let tokenId: Awaited<ReturnType<typeof getTokenId>>;
let memberPGiveId: number;

vi.spyOn(syncCosouls, 'isHistoricalPGiveFinished').mockResolvedValue(true);
const req = {
  headers: { verification_key: process.env.HASURA_EVENT_SECRET },
} as unknown as VercelRequest;
const res: any = { status: vi.fn(() => res), json: vi.fn() };
let user: any;
let profile: any;

beforeEach(async () => {
  snapshotId = await takeSnapshot();

  mainAccount = (await provider().listAccounts())[0];
  profile = await createProfile(adminClient, { address: mainAccount });
  console.log(profile.id, profile.address);
  user = await createUser(adminClient, { profile_id: profile.id });
  contract = (await Contracts.fromProvider(provider())).cosoul;
});

afterEach(async () => {
  await adminClient.mutate(
    {
      delete_member_epoch_pgives_by_pk: [
        { id: memberPGiveId },
        { __typename: true },
      ],
    },
    { operationName: 'syncCoSoul__deleteMemberEpochPGive' }
  );
  await restoreSnapshot(snapshotId);
});
test('updated give is synched on chain', async () => {
  const tx = await contract.mint();
  tokenId = await getTokenId(mainAccount);
  assert(tokenId);
  await adminClient.mutate(
    {
      insert_cosouls_one: [
        {
          object: {
            created_tx_hash: tx.hash,
            token_id: tokenId,
            address: mainAccount,
            checked_at: null,
          },
          on_conflict: {
            constraint: cosouls_constraint.cosouls_token_id_key,
            update_columns: [
              cosouls_update_column.token_id,
              cosouls_update_column.created_tx_hash,
              cosouls_update_column.address,
              cosouls_update_column.checked_at,
            ],
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'syncCoSoulTest__insertCoSoul',
    }
  );
  const { insert_member_epoch_pgives_one: memberPGive } =
    await adminClient.mutate(
      {
        insert_member_epoch_pgives_one: [
          {
            object: {
              user_id: user.id,
              epoch_id: 1,
              pgive: 500,
              normalized_pgive: 500,
            },
          },
          { id: true },
        ],
      },
      { operationName: 'syncCoSoul__insertMemberEpochPGive' }
    );
  assert(memberPGive);
  memberPGiveId = memberPGive.id;
  await handler(req, res);

  expect(res.json).toHaveBeenCalled();
  expect(await getOnChainPGIVE(tokenId)).toEqual(500);
});
