import { VercelRequest, VercelResponse } from '@vercel/node';

import handler from '../../api-lib/event_triggers/createReactionInteractionEvent';
import { adminClient } from '../gql/adminClient';

jest.mock('../gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

describe('#handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('fetches data and creates interaction event', async () => {
    (adminClient.query as jest.Mock).mockImplementation(() =>
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
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as VercelResponse;

    await handler(req, res);

    expect(adminClient.query as jest.Mock).toBeCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
