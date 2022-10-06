import { VercelRequest } from '@vercel/node';

import { getUserFromProfileId } from '../../../../api-lib/findUser';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { mockCircle } from '../../../../src/utils/testing/mocks';

import handler from './deleteUser';

jest.mock('../../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

jest.mock('../../../../api-lib/findUser', () => ({
  getUserFromProfileId: jest.fn(),
}));

const makeRequest = (userIndex: number) => {
  return {
    headers: { verification_key: process.env.HASURA_EVENT_SECRET },
    body: {
      input: {
        payload: {
          circle_id: mockCircle.id,
          address: mockCircle.users[userIndex].address,
        },
      },
      action: { name: 'deleteUser' },
      session_variables: {
        'x-hasura-address': mockCircle.users[0].address,
        'x-hasura-user-id': mockCircle.users[0].id.toString(),
        'x-hasura-role': 'user',
      },
    },
  } as unknown as VercelRequest;
};

describe('Delete User action handler', () => {
  test('Test deletion of another user as non Admin flow', async () => {
    const res: any = { status: jest.fn(() => res), json: jest.fn() };

    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({ users: [mockCircle.users[1]] })
    );

    (adminClient.mutate as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        update_users_by_pk: { id: mockCircle.users[1].id },
        delete_teammates: [null],
      })
    );

    (getUserFromProfileId as jest.Mock).mockImplementation(() => {
      return { role: 0 };
    });

    await expect(handler(makeRequest(1), res)).rejects.toThrow;
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Test deletion another user as an admin flow', async () => {
    const res: any = { status: jest.fn(() => res), json: jest.fn() };

    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({ users: [mockCircle.users[1]] })
    );

    (adminClient.mutate as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        update_users_by_pk: { id: mockCircle.users[1].id },
        delete_teammates: [null],
      })
    );

    (getUserFromProfileId as jest.Mock).mockImplementation(() => {
      return { role: 1 };
    });

    await handler(makeRequest(1), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.success).toBeTruthy();
  });

  test('Test self delete as non admin ', async () => {
    const res: any = { status: jest.fn(() => res), json: jest.fn() };

    (adminClient.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({ users: [mockCircle.users[0]] })
    );

    (adminClient.mutate as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        update_users_by_pk: { id: mockCircle.users[0].id },
        delete_teammates: [null],
      })
    );

    (getUserFromProfileId as jest.Mock).mockImplementation(() => {
      return { role: 0 };
    });

    await handler(makeRequest(0), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    const results = (res.json as any).mock.calls[0][0];
    expect(results.success).toBeTruthy();
  });
});
