vi.mock('puppeteer-core', () => {
  return { default: {} };
});
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
import * as cosoulApi from '../../../src/features/cosoul/api/cosoul';
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
let secondAccount: string;
let mainTokenId: number | undefined;
let secondTokenId: number | undefined;
let accounts: string[];
let user: any;
let user2: any;
let mainTx: Awaited<ReturnType<typeof contract.mint>>;
let secondTx: Awaited<ReturnType<typeof contract.mint>>;
let epochId: number;

const req = {
  headers: { verification_key: process.env.HASURA_EVENT_SECRET },
} as unknown as VercelRequest;

const res: any = { status: vi.fn(() => res), json: vi.fn() };

describe('syncCoSouls cron', () => {
  beforeEach(async () => {
    vi.spyOn(syncCosouls, 'isHistoricalPGiveFinished').mockResolvedValue(true);
    vi.spyOn(cosoulApi, 'setOnChainPGive');
    vi.spyOn(cosoulApi, 'setBatchOnChainPGive');

    snapshotId = await takeSnapshot();

    accounts = await provider().listAccounts();

    mainAccount = accounts[0];
    const mainProfile = await createProfile(adminClient, {
      address: mainAccount,
    });
    user = await createUser(adminClient, { profile_id: mainProfile.id });

    contract = (await Contracts.fromProvider(provider())).cosoul;

    mainTx = await contract.mint();
    mainTokenId = await cosoulApi.getTokenId(mainAccount);

    secondAccount = accounts[1];
    const secondProfile = await createProfile(adminClient, {
      address: secondAccount,
    });
    user2 = await createUser(adminClient, { profile_id: secondProfile.id });

    secondTx = await cosoulApi.mintCoSoulForAddress(secondAccount);
    secondTokenId = await cosoulApi.getTokenId(secondAccount);

    await adminClient.mutate(
      {
        delete_member_epoch_pgives: [
          {
            where: {},
          },
          { affected_rows: true },
        ],
      },
      { operationName: 'syncCoSoul__deleteMembersEpochPGive' }
    );

    const { insert_epochs_one } = await adminClient.mutate(
      {
        insert_cosouls: [
          {
            objects: [
              {
                created_tx_hash: mainTx.hash,
                token_id: mainTokenId,
                address: mainAccount,
                checked_at: null,
                pgive: 1,
              },
              {
                created_tx_hash: secondTx.hash,
                token_id: secondTokenId,
                address: secondAccount,
                checked_at: null,
                pgive: 1,
              },
            ],
            on_conflict: {
              constraint: cosouls_constraint.cosouls_token_id_key,
              update_columns: [
                cosouls_update_column.token_id,
                cosouls_update_column.created_tx_hash,
                cosouls_update_column.address,
                cosouls_update_column.checked_at,
                cosouls_update_column.pgive,
              ],
            },
          },
          {
            affected_rows: true,
          },
        ],
        insert_epochs_one: [
          {
            object: {
              circle_id: user.circle_id,
              start_date: new Date(
                Date.now() - 3 * 24 * 60 * 60 * 1000
              ).toISOString(),
              end_date: 'now()',
              repeat_data: undefined,
              ended: true,
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

    assert(insert_epochs_one?.id);
    epochId = insert_epochs_one.id;
  });

  afterEach(async () => {
    vi.clearAllMocks();
    await restoreSnapshot(snapshotId);
  });

  afterAll(async () => {
    await adminClient.mutate(
      {
        delete_cosouls: [
          {
            where: {},
          },
          // something needs to be returned in the mutation
          { __typename: true, affected_rows: true },
        ],
      },
      { operationName: 'test__DeleteCosouls' }
    );
  });

  test('updates pgive for one user on chain using setOnChainPGIVE', async () => {
    assert(mainTokenId);
    await adminClient.mutate(
      {
        insert_member_epoch_pgives_one: [
          {
            object: {
              user_id: user.id,
              epoch_id: epochId,
              pgive: 500,
              normalized_pgive: 500,
            },
          },
          { id: true },
        ],
      },
      { operationName: 'syncCoSoul__insertMemberEpochPGive' }
    );
    await handler(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(cosoulApi.setOnChainPGive).toHaveBeenCalledWith({
      tokenId: mainTokenId,
      amount: 500,
    });
    expect(await cosoulApi.getOnChainPGive(mainTokenId)).toEqual(500);
  });

  test('updates pgive for multiple users on chain using setBatchOnChainPGIVE', async () => {
    assert(mainTokenId);
    assert(secondTokenId);
    await adminClient.mutate(
      {
        insert_member_epoch_pgives: [
          {
            objects: [
              {
                user_id: user.id,
                epoch_id: epochId,
                pgive: 320,
                normalized_pgive: 320,
              },
              {
                user_id: user2.id,
                epoch_id: epochId,
                pgive: 330,
                normalized_pgive: 330,
              },
            ],
          },
          { affected_rows: true },
        ],
      },
      { operationName: 'syncCoSoul__insertMembersEpochPGive' }
    );

    await handler(req, res);
    expect(res.json).toHaveBeenCalled();
    expect(cosoulApi.setBatchOnChainPGive).toHaveBeenCalledWith([
      { tokenId: mainTokenId, amount: 320 },
      { tokenId: secondTokenId, amount: 330 },
    ]);
    expect(cosoulApi.setOnChainPGive).not.toBeCalled();
    expect(await cosoulApi.getOnChainPGive(mainTokenId)).toEqual(320);
    expect(await cosoulApi.getOnChainPGive(secondTokenId)).toEqual(330);
  });
});
