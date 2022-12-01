import { VercelRequest } from '@vercel/node';
import { DateTime } from 'luxon';

import { DISTRIBUTION_TYPE } from '../../../../api-lib/constants';
import { formatCustomDate } from '../../../../api-lib/dateTimeHelpers';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getEpoch } from '../../../../api-lib/gql/queries';

import handler, { CircleDetails, generateCsvValues } from './allocationCsv';

jest.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn() },
}));

jest.mock('../../../../api-lib/gql/queries', () => ({
  getEpoch: jest.fn(),
}));

jest.mock('../../../../api-lib/s3', () => ({
  uploadCsv: jest.fn((name: string) => Promise.resolve({ Location: name })),
}));

const mockInputs = {
  circle_id: 1,
  epoch_id: 1,
  epoch: 1,
  form_gift_amount: 123,
  gift_token_symbol: 'DAI',
};

const req = {
  headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  body: {
    input: {
      payload: { ...mockInputs },
    },
    action: { name: 'allocationCsv' },
    session_variables: { 'x-hasura-role': 'admin' },
  },
} as unknown as VercelRequest;

const res: any = { status: jest.fn(() => res), json: jest.fn() };

const mockEpoch = {
  id: mockInputs.epoch_id,
  start_date: DateTime.now().minus({ days: 1 }),
  end_date: DateTime.now().plus({ days: 1 }),
  grant: 0,
  number: mockInputs.epoch,
  circle: {
    name: 'Mock Circle',
    organization: { name: 'Mock Organisation' },
  },
  token_gifts: [{ tokens: 50 }, { tokens: 100 }],
};

function getMockCircleDistribution(
  type?: DistributionType | undefined
): CircleDetails {
  const distributions = [];
  switch (type) {
    case DISTRIBUTION_TYPE.FIXED:
      distributions.push({
        distribution_type: DISTRIBUTION_TYPE.FIXED,
        distribution_json: {
          fixedGifts: {
            '0x1': '150000000000000000000',
            '0x2': '200000000000000000000',
          },
        },
        tx_hash: '0x',
        vault: {
          symbol: 'DAI',
          chain_id: 1,
          vault_address: '0x1',
          simple_token_address: '0x0',
          decimals: 18,
          price_per_share: 1,
        },
        claims: [
          { address: '0x1', profile_id: 1, new_amount: 150 },
          { address: '0x2', profile_id: 2, new_amount: 200 },
        ],
      });
      break;
    case DISTRIBUTION_TYPE.GIFT:
      distributions.push({
        distribution_type: DISTRIBUTION_TYPE.GIFT,
        distribution_json: {},
        tx_hash: '0x',
        vault: {
          symbol: 'DAI',
          chain_id: 1,
          vault_address: '0x1',
          simple_token_address: '0x0',
          decimals: 18,
          price_per_share: 1,
        },
        claims: [
          { address: '0x1', profile_id: 1, new_amount: 150 },
          { address: '0x2', profile_id: 2, new_amount: 75 },
        ],
      });
      break;
    case DISTRIBUTION_TYPE.COMBINED:
      distributions.push({
        distribution_type: DISTRIBUTION_TYPE.COMBINED,
        distribution_json: {
          fixedGifts: {
            '0x1': '100000000000000000000',
            '0x2': '101000000000000000000',
          },
        },
        tx_hash: '0x',
        vault: {
          symbol: 'DAI',
          chain_id: 1,
          vault_address: '0x1',
          simple_token_address: '0x0',
          decimals: 18,
          price_per_share: 1,
        },
        claims: [
          { address: '0x1', profile_id: 1, new_amount: 250 },
          { address: '0x2', profile_id: 2, new_amount: 175 },
        ],
      });
      break;
    default:
      break;
  }
  return {
    fixed_payment_token_type: 'DAI',
    epochs: [{ distributions }],
    users: [
      {
        id: 1,
        name: 'User 1',
        address: '0x1',
        fixed_payment_amount: 100,
        profile: { id: 1 },
        received_gifts: [{ tokens: 100 }],
        sent_gifts: [{ tokens: 50 }],
      },
      {
        id: 2,
        name: 'User 2',
        address: '0x2',
        fixed_payment_amount: 101,
        profile: { id: 2 },
        received_gifts: [{ tokens: 50 }],
        sent_gifts: [{ tokens: 100 }],
      },
    ],
  };
}

describe('Allocation CSV Calculation', () => {
  test('Test generation of CSV', async () => {
    (getEpoch as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        ...mockEpoch,
      })
    );

    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve(getMockCircleDistribution())
    );

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.file).toContain(
      `epoch-1-date-${formatCustomDate(
        mockEpoch.start_date,
        'ddLLyy'
      )}-${formatCustomDate(mockEpoch.end_date, 'ddLLyy')}`
    );
  });

  test('No distribution, just preview values', async () => {
    const circle = getMockCircleDistribution();
    const results = generateCsvValues(
      circle,
      mockInputs.form_gift_amount,
      mockInputs.gift_token_symbol,
      150,
      !!circle.fixed_payment_token_type,
      circle.fixed_payment_token_type,
      0
    );
    //percentage_of_give
    expect(results[0][6]).toEqual('66.67');
    //circle rewards
    expect(results[0][7]).toEqual('82.00');
    //gift token
    expect(results[0][8]).toEqual('DAI');
    //fixed payment amount
    expect(results[0][9]).toEqual('100.00');
    //fixed payment token
    expect(results[0][10]).toEqual('DAI');
  });

  test('Fixed Distribution Only', async () => {
    const circle = getMockCircleDistribution(DISTRIBUTION_TYPE.FIXED);
    const results = generateCsvValues(
      circle,
      mockInputs.form_gift_amount,
      mockInputs.gift_token_symbol,
      150,
      !!circle.fixed_payment_token_type,
      circle.fixed_payment_token_type,
      0
    );
    //fixed payment amount
    expect(results[0][9]).toEqual('150.00');
    expect(results[1][9]).toEqual('200.00');
  });

  test('Gift Distribution Only', async () => {
    const circle = getMockCircleDistribution(DISTRIBUTION_TYPE.GIFT);
    const results = generateCsvValues(
      circle,
      mockInputs.form_gift_amount,
      mockInputs.gift_token_symbol,
      150,
      !!circle.fixed_payment_token_type,
      circle.fixed_payment_token_type,
      0
    );
    //circle reward claimed
    expect(results[0][7]).toEqual('150.00');
    expect(results[1][7]).toEqual('75.00');
  });

  test('Combined Distribution', async () => {
    const circle = getMockCircleDistribution(DISTRIBUTION_TYPE.COMBINED);
    const results = generateCsvValues(
      circle,
      mockInputs.form_gift_amount,
      mockInputs.gift_token_symbol,
      150,
      !!circle.fixed_payment_token_type,
      circle.fixed_payment_token_type,
      0
    );
    //fixed payment amount
    expect(results[0][9]).toEqual('100.00');
    expect(results[1][9]).toEqual('101.00');
  });
});

type DistributionType =
  typeof DISTRIBUTION_TYPE[keyof typeof DISTRIBUTION_TYPE];
