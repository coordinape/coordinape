import { VercelRequest } from '@vercel/node';

import { adminClient } from '../../../../api-lib/gql/adminClient';
import { mockContribution } from '../../../../src/utils/testing/mocks';

import handler from './deleteContribution';

jest.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

const req = {
  headers: { verification_key: process.env.HASURA_EVENT_SECRET },
  body: {
    input: {
      payload: { contribution_id: 1 },
    },
    action: { name: 'deleteContribution' },
    session_variables: {
      'x-hasura-address': mockContribution.user.address,
      'x-hasura-user-id': mockContribution.user.id.toString(),
      'x-hasura-role': 'user',
    },
  },
} as unknown as VercelRequest;

const res: any = { status: jest.fn(() => res), json: jest.fn() };

describe('Delete Contribution action handler', () => {
  test('Test normal delete contribution flow', async () => {
    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );

    (adminClient.mutate as jest.Mock).mockImplementation(() =>
      Promise.resolve({})
    );

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.success).toBeTruthy();
  });

  test('Test deletion of a contribution that you did not create', async () => {
    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );

    req.body.session_variables['x-hasura-address'] =
      '0x63c389cb2c573dd8a9239a16a3eb65935ddb5e2e';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  test('Test deletion of a contribution that is attached to an ended epoch', async () => {
    mockContribution.epoch.ended = true;
    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  test('Test deletion of a contribution that is attached to no epoch', async () => {
    // const { epoch: _, ...noEpochContribution } = mockContribution;
    Reflect.deleteProperty(mockContribution, 'epoch');
    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        contributions_by_pk: mockContribution,
      })
    );
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(422);
  });
});
