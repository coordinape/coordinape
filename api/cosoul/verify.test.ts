import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DateTime } from 'luxon';

import { createProfile } from '../../api-test/helpers';
import handler from './verify';
import { isValidSignature } from '../../api-lib/tenderlySignature';
import { adminClient } from '../../api-lib/gql/adminClient';

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
      block_hash:
        '0x1c8e15d6b991c627e6a6df696f5e25c12adb6bb8eb2902776e87c147d679aff4',
      block_number: 107617119,
      logs: [
        {
          address: '0x47c2A56176335fB2B1deD8e7B5acB136d307dc2d',
          topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x000000000000000000000000c081165e1de6bcdcf22b8132ceb7c3e8a2929e83',
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

  describe('with valid signature', () => {});
  describe('unknown address ', () => {});
  describe('address with existing profile', () => {
    beforeAll(async () => {
      profile = await createProfile(adminClient);
    });
    it('returns 200 success', async () => {
      (isValidSignature as jest.Mock).mockReturnValue(true);
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('cosoul minted with a profile', async () => {
      (isValidSignature as jest.Mock).mockReturnValue(true);
      // getMintInfofromLogs as jest.Mock).mockReturnValue({})
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('cosoul minted with no profile', async () => {
      (isValidSignature as jest.Mock).mockReturnValue(true);
      // getMintInfofromLogs as jest.Mock).mockReturnValue({})
      await handler(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
