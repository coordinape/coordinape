import type { VercelRequest, VercelResponse } from '@vercel/node';
import faker from 'faker';

import { isValidSignatureForStringBody } from '../../api-lib/alchemySignature';
import { adminClient } from '../../api-lib/gql/adminClient';
import { createProfile } from '../../api-test/helpers';

import handler from './alchemy_cosoul';

const address = faker.unique(faker.finance.ethereumAddress);

const minted_req = {
  headers: {
    'x-alchemy-signature': 'bad-sig',
  },

  body: {
    webhookId: 'wh_ow5nupt9gmbrux9g',
    id: 'whevt_09xyz8ryar37i4la',
    createdAt: '2023-10-19T00:15:35.584894990Z',
    type: 'GRAPHQL',
    event: {
      data: {
        block: {
          hash: '0x702d89f5060838bdf7a1670504929ccf84e189abe1598612d58ef82fc19e4850',
          logs: [
            {
              topics: [
                '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                '0x0000000000000000000000000000000000000000000000000000000000000000',
                `0x000000000000000000000000${address.slice(2)}`,
                '0x0000000000000000000000000000000000000000000000000000000000006498',
              ],
              data: '0x',
              transaction: {
                hash: '0x063a99174eec785345413a611ce3f62a8bfbda4680220398b8ba53e8ae4321a8',
                index: 6,
                to: { address: '0x47c2a56176335fb2b1ded8e7b5acb136d307dc2d' },
                from: { address: '0x1186835ce1fc896c50f6cc7490388fbc556617dc' },
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

beforeEach(() => {
  process.env.COSOUL_WEBHOOK_ALCHEMY_SIGNING_KEY = 'test-key';
});

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('../../api-lib/alchemySignature.ts');

let profile;

describe('CoSoul Alchemy Webhook', () => {
  describe('with invalid signature', () => {
    it('errors without valid signatures', async () => {
      (isValidSignatureForStringBody as jest.Mock).mockReturnValue(false);
      await handler(minted_req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('mint webhook with valid signature', () => {
    beforeEach(async () => {
      (isValidSignatureForStringBody as jest.Mock).mockReturnValue(true);
    });

    afterEach(async () => {
      await deleteCosouls();
    });

    describe('unknown address without profile ', () => {
      it('creates cosoul without profile', async () => {
        expect(await getCosouls()).toHaveLength(0);
        await handler(minted_req, res);
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

        await handler(minted_req, res);

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
