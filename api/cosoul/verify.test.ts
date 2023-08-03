import type { VercelRequest, VercelResponse } from '@vercel/node';
import faker from 'faker';
import { DateTime } from 'luxon';

import { adminClient } from '../../api-lib/gql/adminClient';
import { isValidSignature } from '../../api-lib/tenderlySignature';
import { createProfile } from '../../api-test/helpers';

import handler from './verify';

const address = faker.unique(faker.finance.ethereumAddress);

const req = {
  headers: {
    'x-tenderly-signature': 'bad-sig',
    // set the date header to current time as a string
    date: DateTime.now().toISO(),
  },
  body: {
    event_type: 'ALERT',
    transaction: {
      network: '10',
      hash: '0x7055dd157be7e0fba1e5587dc1c065f51a3c3ca9cc749d96b97322c0718939a9',
      block_hash:
        '0x1c8e15d6b991c627e6a6df696f5e25c12adb6bb8eb2902776e87c147d679aff4',
      block_number: 107617119,
      logs: [
        {
          address: '0x47c2A56176335fB2B1deD8e7B5acB136d307dc2d',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            `0x000000000000000000000000${address.slice(2)}`,
            '0x0000000000000000000000000000000000000000000000000000000000002ae4',
          ],
          data: '0x',
        },
      ],
    },
  },
} as unknown as VercelRequest;

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as VercelResponse;

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('../../api-lib/tenderlySignature');

let profile;

describe('CoSoul Verify', () => {
  describe('with invalid signature', () => {
    it('errors without valid tenderly signatures', async () => {
      (isValidSignature as jest.Mock).mockReturnValue(false);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('with valid signature', () => {
    beforeEach(async () => {
      (isValidSignature as jest.Mock).mockReturnValue(true);
    });

    afterEach(async () => {
      await deleteCosouls();
    });

    describe('unknown address without profile ', () => {
      it('creates cosoul without profile', async () => {
        expect(await getCosouls()).toHaveLength(0);
        await handler(req, res);
        expect(res.status).toHaveBeenCalledWith(200);

        const cosouls = await getCosouls();

        expect(cosouls).toHaveLength(1);
        expect(cosouls[0].profile).toEqual(null);
      });
    });
    describe('address with existing profile', () => {
      it('creates cosoul with profile', async () => {
        expect(await getCosouls()).toHaveLength(0);
        profile = await createProfile(adminClient, {
          address: address,
        });

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        const cosouls = await getCosouls();
        expect(cosouls).toHaveLength(1);
        expect(cosouls[0]?.profile?.id).toEqual(profile?.id);
      });
    });
  });
});

const deleteCosouls = async () => {
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
};

const getCosouls = async () => {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {},
        },
        {
          __typename: true,
          id: true,
          token_id: true,
          address: true,
          profile: { id: true, address: true },
        },
      ],
    },
    { operationName: 'test__GetCosouls' }
  );

  return cosouls;
};
