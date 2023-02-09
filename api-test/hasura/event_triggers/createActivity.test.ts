import { VercelRequest, VercelResponse } from '@vercel/node';

import handler from '../../../api-lib/event_triggers/createActivity';
import { adminClient } from '../../../api-lib/gql/adminClient';
import { insertActivity } from '../../../api-lib/gql/mutations';

import {
  contributions_payload,
  invalid_payload,
} from './createActivity.payloads';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn() },
}));

jest.mock('../../../api-lib/gql/mutations', () => ({
  insertActivity: jest.fn(),
}));

describe('Create Activity Event Trigger', () => {
  describe('#handler', () => {
    test('throws an error on unknown table name', async () => {
      (adminClient.query as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          circles_by_pk: {
            id: 3,
            organization_id: 9,
            users: [{ profile: { id: 187 } }],
          },
        })
      );

      try {
        const req = { body: invalid_payload } as VercelRequest;
        const res = {
          status: jest.fn(() => res),
          json: jest.fn(),
        } as unknown as VercelResponse;

        await handler(req, res);

        expect(insertActivity as jest.Mock).toBeCalledTimes(0);
        expect(res.status).toHaveBeenCalledWith(500);
      } catch (e) {
        console.error(e);
      }
    });

    test('can receive contribution insert and inserts new activty', async () => {
      (adminClient.query as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          circles_by_pk: {
            id: 3,
            organization_id: 9,
            users: [{ profile: { id: 187 } }],
          },
        })
      );

      try {
        const req = { body: contributions_payload } as VercelRequest;
        const res = {
          status: jest.fn(() => res),
          json: jest.fn(),
        } as unknown as VercelResponse;

        await handler(req, res);

        expect(insertActivity as jest.Mock).toBeCalledTimes(1);
        expect(insertActivity as jest.Mock).toBeCalledWith(
          expect.objectContaining({
            circle_id: 373,
            organization_id: 9,
            contribution_id: 538,
            action: 'contributions_insert',
            actor_profile_id: 187,
          })
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'activity recorded' });
      } catch (e) {
        console.error(e);
      }
    });
  });
});
