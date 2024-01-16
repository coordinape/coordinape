import { VercelRequest, VercelResponse } from '@vercel/node';
import { Mock, vi } from 'vitest';

import handler from '../../../../api-lib/event_triggers/activity/index';
import { insertActivity } from '../../../../api-lib/event_triggers/activity/mutations';
import { adminClient } from '../../../../api-lib/gql/adminClient';

import { fixtures } from './fixtures';

vi.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: vi.fn() },
}));

vi.mock('../../../../api-lib/event_triggers/activity/mutations', () => ({
  insertActivity: vi.fn(),
}));

describe('#handler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('throws an error on unknown table name', async () => {
    try {
      const req = { body: fixtures.invalid_payload } as VercelRequest;
      const res = {
        status: vi.fn(() => res),
        json: vi.fn(),
      } as unknown as VercelResponse;

      await handler(req, res);

      expect(insertActivity as Mock).toBeCalledTimes(0);
      expect(res.status).toHaveBeenCalledWith(500);
    } catch (e) {
      console.error(e);
    }
  });

  test('can receive contribution insert and inserts new activty', async () => {
    (adminClient.query as Mock).mockImplementation(() =>
      Promise.resolve({
        circles_by_pk: {
          id: 3,
          organization_id: 9,
          users: [{ profile: { id: 187 } }],
        },
      })
    );

    let req, res;
    try {
      req = { body: fixtures.contribution_insert } as VercelRequest;
      res = {
        status: vi.fn(() => res),
        json: vi.fn(),
      } as unknown as VercelResponse;

      await handler(req, res);
    } catch (e) {
      console.error(e);
    }

    expect(insertActivity as Mock).toBeCalledTimes(1);
    expect(insertActivity as Mock).toBeCalledWith(
      expect.objectContaining({
        circle_id: 373,
        organization_id: 9,
        contribution_id: 538,
        action: 'contributions_insert',
        actor_profile_id: 187,
        private_stream: false,
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'activity recorded' });
  });

  test('can receive users insert and inserts new activity', async () => {
    (adminClient.query as Mock).mockImplementation(() =>
      Promise.resolve({
        circles_by_pk: {
          id: 15,
          organization_id: 9,
          users: [{ profile: { id: 100 } }],
        },
      })
    );

    let req, res;
    try {
      req = { body: fixtures.user_insert };
      res = {
        status: vi.fn(() => res),
        json: vi.fn(),
      } as unknown as VercelResponse;

      await handler(req, res);
    } catch (e) {
      console.error(e);
    }
    expect(insertActivity as Mock).toBeCalledTimes(1);
    expect(insertActivity as Mock).toBeCalledWith(
      expect.objectContaining({
        circle_id: 15,
        organization_id: 9,
        user_id: 267,
        action: 'users_insert',
        target_profile_id: 100,
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'activity recorded' });
  });

  test('can receive epochs insert and inserts new activty', async () => {
    (adminClient.query as Mock).mockImplementation(() =>
      Promise.resolve({
        epochs_by_pk: {
          id: 3,
          circle: { organization: { id: 5 } },
        },
      })
    );

    let req, res;
    try {
      req = { body: fixtures.epoch_insert } as VercelRequest;
      res = {
        status: vi.fn(() => res),
        json: vi.fn(),
      } as unknown as VercelResponse;

      await handler(req, res);
    } catch (e) {
      console.error(e);
    }

    expect(insertActivity as Mock).toBeCalledTimes(1);
    expect(insertActivity as Mock).toBeCalledWith(
      expect.objectContaining({
        circle_id: 15,
        epoch_id: 47,
        action: 'epochs_insert',
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'activity recorded' });
  });
});
