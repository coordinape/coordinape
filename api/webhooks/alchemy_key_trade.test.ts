import type { VercelRequest, VercelResponse } from '@vercel/node';

import { isValidSignature } from '../../api-lib/alchemySignature';
import { adminClient } from '../../api-lib/gql/adminClient';

import handler from './alchemy_key_trade';

const trade_req = {
  headers: {
    'x-alchemy-signature': 'bad-sig',
  },
  body: {
    webhookId: 'wh_2ems5leedljza922',
    id: 'whevt_1mlcd4fozo3zbh6z',
    createdAt: '2023-10-19T04:20:17.135886570Z',
    type: 'GRAPHQL',
    event: {
      data: {
        block: {
          hash: '0x3f9cdea4b7594e126fbe1e9267a8bf6d8455d6857b8957c8d2231517c5217e93',
          logs: [
            {
              topics: [
                '0x2c76e7a47fd53e2854856ac3f0a5f3ee40d15cfaa82266357ea9779c486ab9c3',
              ],
              data: '0x000000000000000000000000065f56506474db0384583867f01ceeaf5ed2ad1c000000000000000000000000065f56506474db0384583867f01ceeaf5ed2ad1c00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000038d7ea4c6800000000000000000000000000000000000000000000000000000002d79883d200000000000000000000000000000000000000000000000000000002d79883d2000000000000000000000000000000000000000000000000000000000000000002',
              transaction: {
                hash: '0x7a0f2f5eac21fec3d0a9fe6bc9723e70363068b1aa032ebcece920d98be394c6',
                index: 1,
                to: { address: '0xbb57fe325e769dedb1236525a91cded842143fa7' },
                from: { address: '0x065f56506474db0384583867f01ceeaf5ed2ad1c' },
                status: 1,
              },
            },
          ],
        },
      },
      sequenceNumber: '10000000000578619000',
    },
  },
} as unknown as VercelRequest;

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
  send: jest.fn(),
} as unknown as VercelResponse;

jest.mock('../../api-lib/alchemySignature.ts');

describe('CoLinks Alchemy Webhook', () => {
  beforeEach(() => {
    process.env.KEY_TRADE_WEBHOOK_ALCHEMY_SIGNING_KEY = 'test-key';
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await deleteKeyHolders();
  });

  describe('with invalid signature', () => {
    it('errors without valid signatures', async () => {
      (isValidSignature as jest.Mock).mockReturnValue(false);
      await handler(trade_req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('with valid signature', () => {
    beforeEach(async () => {
      (isValidSignature as jest.Mock).mockReturnValue(true);
    });
    it('parses the trade event', async () => {
      const key_holders = await getKeyHolders();
      expect(key_holders).toEqual([]);

      await handler(trade_req, res);
      expect(res.status).toHaveBeenCalledWith(200);

      const key_holders2 = await getKeyHolders();
      expect(key_holders2).toEqual([
        {
          address: '0x065F56506474dB0384583867f01Ceeaf5Ed2aD1c',
          amount: 1,
          subject: '0x065f56506474db0384583867f01ceeaf5ed2ad1c',
        },
      ]);
    });
  });
});

const getKeyHolders = async () => {
  const { link_holders } = await adminClient.query(
    {
      link_holders: [
        {
          where: {},
        },
        {
          target: true,
          holder: true,
          amount: true,
        },
      ],
    },
    { operationName: 'test__GetLinkHolders' }
  );

  return link_holders;
};
const deleteKeyHolders = async () => {
  await adminClient.mutate(
    {
      delete_link_holders: [
        {
          where: {},
        },
        { __typename: true, affected_rows: true },
      ],
    },
    { operationName: 'test__DeleteLinkHolders' }
  );
};
