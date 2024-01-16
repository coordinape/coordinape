import { VercelRequest, VercelResponse } from '@vercel/node';
import { Mock, vi } from 'vitest';

import handler from '../../api-lib/event_triggers/createReactionInteractionEvent';
import { adminClient } from '../gql/adminClient';

vi.mock('../gql/adminClient', () => ({
  adminClient: { query: vi.fn(), mutate: vi.fn() },
}));

describe('#handler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  test('fetches data and creates interaction event', async () => {
    (adminClient.query as Mock).mockImplementation(() =>
      Promise.resolve({
        reactions_by_pk: {
          activity: {
            circle_id: 123,
          },
        },
      })
    );

    const req = {
      body: {
        event: {
          data: {
            new: {
              activity_id: 115,
              created_at: Date.now(),
              id: 200,
              profile_id: 5282,
              reaction: '👀',
              updated_at: Date.now(),
            },
            old: null,
          },
          op: 'INSERT',
        },
        id: '7b8d4554-c8c6-462d-afdc-860ce1f168c4',
        table: { name: 'reactions', schema: 'public' },
        trigger: { name: 'createReactionInteractionEvent' },
      },
    } as VercelRequest;

    const res = {
      status: vi.fn(() => res),
      json: vi.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(adminClient.query as Mock).toBeCalledTimes(1);
    expect(adminClient.mutate as Mock).toBeCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
