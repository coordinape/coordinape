import type { VercelRequest } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import handler from '../../../api/hasura/cron/pGiveHistoricalGen';
import {
  createCircle,
  createEpoch,
  createTokenGift,
  createUser,
} from '../../helpers';
import { getUniqueAddress } from '../../helpers/getUniqueAddress';

let circle, epoch, user1, user2, user3;
beforeEach(async () => {
  const address1 = await getUniqueAddress();
  const address2 = await getUniqueAddress();
  const address3 = await getUniqueAddress();

  circle = await createCircle(adminClient);
  const createDate = DateTime.local().minus({ months: 3 }).toISO();
  user1 = await createUser(adminClient, {
    address: address1,
    circle_id: circle.id,
    created_at: createDate,
  });

  user2 = await createUser(adminClient, {
    address: address2,
    circle_id: circle.id,
    created_at: createDate,
  });

  user3 = await createUser(adminClient, {
    address: address3,
    circle_id: circle.id,
    created_at: createDate,
  });

  epoch = await createEpoch(adminClient, {
    circle_id: circle.id,
    start_date: DateTime.local().minus({ months: 2 }),
    days: 3,
  });

  await createTokenGift(adminClient, {
    sender_id: user1.id,
    sender_address: address1,
    recipient_id: user2.id,
    recipient_address: address2,
    tokens: 10,
    note: 'note',
    circle_id: circle.id,
    epoch_id: epoch.id,
  });

  await createTokenGift(adminClient, {
    sender_id: user2.id,
    sender_address: address2,
    recipient_id: user1.id,
    recipient_address: address1,
    tokens: 40,
    note: 'note',
    circle_id: circle.id,
    epoch_id: epoch.id,
  });

  await createTokenGift(adminClient, {
    sender_id: user2.id,
    sender_address: address2,
    recipient_id: user3.id,
    recipient_address: address3,
    tokens: 0,
    note: 'note',
    circle_id: circle.id,
    epoch_id: epoch.id,
  });
  await createTokenGift(adminClient, {
    sender_id: user3.id,
    sender_address: address3,
    recipient_id: user1.id,
    recipient_address: address1,
    tokens: 10,
    note: 'note',
    circle_id: circle.id,
    epoch_id: epoch.id,
  });
});

test('Test backfilling of pgive', async () => {
  const req = {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  } as unknown as VercelRequest;
  const res: any = { status: jest.fn(() => res), json: jest.fn() };

  await handler(req, res);

  expect(res.json).toHaveBeenCalled();
  const results = (res.json as any).mock.calls[0][0];
  expect(results.circleIds.includes(circle.id)).toBeTruthy();

  const { epoch_pgive_data, member_epoch_pgives } = await adminClient.query({
    epoch_pgive_data: [
      {
        where: {
          epoch_id: { _eq: epoch.id },
        },
      },
      {
        pgive: true,
        gives_receiver_base: true,
        notes_bonus: true,
      },
    ],
    member_epoch_pgives: [
      {
        where: {
          epoch_id: { _eq: epoch.id },
        },
      },
      {
        user_id: true,
        pgive: true,
        opt_out_bonus: true,
      },
    ],
  });

  expect(epoch_pgive_data[0].pgive).toBe(360);
  expect(epoch_pgive_data[0].gives_receiver_base).toBe(300);
  expect(epoch_pgive_data[0].notes_bonus).toBe(60);
  expect(member_epoch_pgives[0].pgive).toBe(291.67);
  expect(member_epoch_pgives[1].pgive).toBe(58.33);
  expect(member_epoch_pgives[2].pgive).toBe(10);
  expect(member_epoch_pgives[2].opt_out_bonus).toBe(10);
}, 10000);

afterEach(async () => {
  const whereCon = {
    where: {
      circle_id: { _eq: circle.id },
    },
  };

  await adminClient.mutate({
    delete_token_gifts: [
      whereCon,
      {
        __typename: true,
      },
    ],
    delete_member_epoch_pgives: [{ where: {} }, { __typename: true }],
    delete_epoch_pgive_data: [{ where: {} }, { __typename: true }],
    delete_epochs: [
      whereCon,
      {
        __typename: true,
      },
    ],
    delete_users: [
      whereCon,
      {
        __typename: true,
      },
    ],
    delete_circles_by_pk: [
      {
        id: circle.id,
      },
      {
        __typename: true,
      },
    ],
  });
});
