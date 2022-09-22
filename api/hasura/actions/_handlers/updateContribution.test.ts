import { VercelRequest } from '@vercel/node';
import { DateTime } from 'luxon';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { mockContribution } from '../../../../src/utils/testing/mocks';

import handler from './updateContribution';

jest.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));
const default_req = {
  id: 1,
  datetime_created: DateTime.now().toISO(),
  description: 'wen moon',
};

const makeRequest = ({
  id,
  datetime_created,
  description,
}: {
  id: number;
  datetime_created: string;
  description: string;
} = default_req) => {
  return {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
    body: {
      input: {
        payload: {
          id,
          datetime_created,
          description,
        },
      },
      action: { name: 'updateContribution' },
      session_variables: {
        'x-hasura-address': mockContribution.user.address,
        'x-hasura-user-id': mockContribution.user.id.toString(),
        'x-hasura-role': 'user',
      },
    },
  } as unknown as VercelRequest;
};

const res: any = { status: jest.fn(() => res), json: jest.fn() };

describe('Update Contribution action handler', () => {
  test('Test normal update contribution flow', async () => {
    (adminClient.query as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );

    (adminClient.mutate as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        update_contributions_by_pk: { id: mockContribution.id },
      })
    );

    await handler(makeRequest(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.id).toBe(mockContribution.id);
  });

  test('cannot modify a contribution in a closed epoch', async () => {
    const res: any = { status: jest.fn(() => res), json: jest.fn() };
    (adminClient.query as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        contributions_by_pk: {
          ...mockContribution,
          datetime_created: DateTime.fromJSDate(
            new Date(Date.now() - 39000 * 1000 * 24)
          ).toISO(),
        },
      })
    );

    (adminClient.mutate as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        update_contributions_by_pk: { id: mockContribution.id },
      })
    );

    await handler(makeRequest(), res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.message).toBe(
      'contribution in an ended epoch is not editable'
    );
  });

  test('cannot move contribution to a closed epoch', async () => {
    const res: any = { status: jest.fn(() => res), json: jest.fn() };
    (adminClient.query as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        contributions_by_pk: {
          ...mockContribution,
          datetime_created: DateTime.now(),
        },
      })
    );

    (adminClient.mutate as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        update_contributions_by_pk: { id: mockContribution.id },
      })
    );

    const req = makeRequest({
      id: 1,
      description: 'yolo',
      datetime_created: new Date(Date.now() - 4000 * 1000 * 24).toISOString(),
    });
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.message).toBe(
      'cannot reassign contribution to a closed epoch'
    );
  });
  test('cannot modify a contribution from a different user', async () => {
    (adminClient.query as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );

    const req = makeRequest();
    req.body.session_variables['x-hasura-address'] =
      '0x63c389cb2c573dd8a9239a16a3eb65935ddb5e2e';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
