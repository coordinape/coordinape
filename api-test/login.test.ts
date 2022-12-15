import { AddressZero } from '@ethersproject/constants';
import padStart from 'lodash/padStart';
import { SiweMessage } from 'siwe';

import handler from '../api/login';

// FIXME test real signature verification
jest.mock('siwe', () => {
  class SiweMessage {
    constructor(data: any) {
      (SiweMessage as any).mock(this, data);
    }
  }
  (SiweMessage as any).mock = jest.fn();
  return { SiweMessage, SiweErrorType: {} };
});

let res;

beforeEach(() => {
  ((SiweMessage as any).mock as jest.Mock).mockImplementation((self, data) => {
    const parsed = JSON.parse(data);
    self.domain = parsed.domain;
    self.chainId = parsed.chainId;
    self.verify = async () => false;
  });

  res = { status: jest.fn(() => res), json: jest.fn() };
});

const mockReq = chainId => ({
  body: {
    input: {
      payload: {
        address: AddressZero,
        data: JSON.stringify({ domain: 'localhost:3000', chainId }),
        hash: 'fakehash',
        signature: '0x' + padStart('1', 130, '0'),
        connectorName: 'fake',
      },
    },
  },
});

test('invalid chain', async () => {
  const req = mockReq(777);
  // @ts-ignore
  await handler(req, res);
  expect(res.json.mock.calls[0][0].message).toEqual('unsupported chain 777');
});

test('valid chain', async () => {
  const req = mockReq(5);
  // @ts-ignore
  await handler(req, res);
  expect(res.json.mock.calls[0][0].message).toEqual('invalid signature');
});
