import { act, fireEvent, render, screen } from '@testing-library/react';
import { client } from 'lib/gql/client';

import { TestWrapper } from 'utils/testing';

import { Group } from './AddMembersPage';
import NewMemberList from './NewMemberList';

const save = async () => {
  return [];
};

const group: Group = {
  id: 1,
  name: 'test',
};

jest.mock('lib/gql/client', () => ({
  client: { query: jest.fn() },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('adding an existing org member will show an error if exists only', () => {
  test('display an error if the the address exists in the org', async () => {
    (client.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        profiles: [{ name: 'user', org_members: [{ id: 1 }] }],
      })
    );

    await act(async () => {
      render(
        <TestWrapper>
          <NewMemberList
            welcomeLink=""
            preloadedMembers={[]}
            save={save}
            group={group}
            groupType="organization"
          />
        </TestWrapper>
      );
    });

    await screen.findByText('Wallet Address');
    fireEvent.change(screen.getAllByPlaceholderText('ETH Address or ENS')[0], {
      target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
    });

    expect(client.query).toBeCalledWith(
      {
        profiles: [
          {
            limit: 1,
            where: {
              address: { _ilike: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
            },
          },
          {
            name: true,
            org_members: [{ where: { org_id: { _eq: 1 } } }, { id: true }],
          },
        ],
      },
      { operationName: 'NewMemberEntry_getUserName' }
    );

    await screen.findByText('existing org member');
  });

  test('display an error if the address does not exists in the org', async () => {
    (client.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        profiles: [{ name: 'user' }],
      })
    );

    await act(async () => {
      render(
        <TestWrapper>
          <NewMemberList
            welcomeLink=""
            preloadedMembers={[]}
            save={save}
            group={group}
            groupType="organization"
          />
        </TestWrapper>
      );
    });

    await screen.findByText('Wallet Address');
    fireEvent.change(screen.getAllByPlaceholderText('ETH Address or ENS')[0], {
      target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
    });
    expect(client.query).toBeCalled();
    await expect(screen.findByText('existing org member')).rejects.toThrow();
  });
});

describe('adding an existing circle member will show an error if exists only', () => {
  test('display an error if the the address exists in the circle', async () => {
    (client.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        profiles: [{ name: 'user', users: [{ id: 1 }] }],
      })
    );

    await act(async () => {
      render(
        <TestWrapper>
          <NewMemberList
            welcomeLink=""
            preloadedMembers={[]}
            save={save}
            group={group}
            groupType="circle"
          />
        </TestWrapper>
      );
    });

    await screen.findByText('Wallet Address');
    fireEvent.change(screen.getAllByPlaceholderText('ETH Address or ENS')[0], {
      target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
    });

    expect(client.query).toBeCalledWith(
      {
        profiles: [
          {
            limit: 1,
            where: {
              address: { _ilike: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
            },
          },
          {
            name: true,
            users: [{ where: { circle_id: { _eq: 1 } } }, { id: true }],
          },
        ],
      },
      { operationName: 'NewMemberEntry_getUserName' }
    );

    await screen.findByText('existing circle member');
  });

  test('display an error if the address does not exists in the circle', async () => {
    (client.query as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        profiles: [{ name: 'user' }],
      })
    );

    await act(async () => {
      render(
        <TestWrapper>
          <NewMemberList
            welcomeLink=""
            preloadedMembers={[]}
            save={save}
            group={group}
            groupType="circle"
          />
        </TestWrapper>
      );
    });

    await screen.findByText('Wallet Address');
    fireEvent.change(screen.getAllByPlaceholderText('ETH Address or ENS')[0], {
      target: { value: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45' },
    });
    expect(client.query).toBeCalled();
    await expect(screen.findByText('existing circle member')).rejects.toThrow();
  });
});
