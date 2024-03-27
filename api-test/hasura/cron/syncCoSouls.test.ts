/* eslint-disable no-console */
import assert from 'assert';

import type { CoSoul } from '@coordinape/contracts/typechain';
import type { VercelRequest } from '@vercel/node';
import { vi } from 'vitest';

import handler from '../../../_api/hasura/cron/syncCoSouls';
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

beforeEach(async () => {
  snapshotId = await takeSnapshot();

  mainAccount = (await provider().listAccounts())[0];
  contract = (await Contracts.fromProvider(provider())).cosoul;
});

afterEach(async () => {
  await restoreSnapshot(snapshotId);
});
test('updated give is synched on chain', async () => {
  await contract.mint();
  tokenId = await getTokenId(mainAccount);
  assert(tokenId);
  const profile = await createProfile(adminClient, { address: mainAccount });
  const user = await createUser(adminClient, { profile_id: profile.id });
  await adminClient.mutate(
    {
      insert_member_epoch_pgives_one: [
        {
          object: { user_id: user.id, epoch_id: 1, pgive: 500 },
        },
        { __typename: true },
      ],
    },
    { operationName: 'syncCoSoul__insertMemberEpochPGive' }
  );

  const req = {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  } as unknown as VercelRequest;
  const res: any = { status: vi.fn(() => res), json: vi.fn() };

  await handler(req, res);

  expect(res.json).toHaveBeenCalled();
  expect(await getOnChainPGIVE(tokenId)).toEqual(500);
});
