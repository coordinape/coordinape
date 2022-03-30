import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { CirclesPage } from './CirclesPage';

jest.mock('hooks/gql/useCurrentOrg', () => ({
  useCurrentOrgId: jest.fn(() => [1, jest.fn()]),
}));

jest.mock('./getOrgData', () => ({
  getOrgData: async () => ({
    organizations: [
      {
        id: 1,
        name: 'Test Org',
        circles: [
          {
            id: 2,
            name: 'Test Circle',
            vouching: true,
            users: [{ role: 1 }],
            epochs: [],
            nominees_aggregate: {
              aggregate: {
                count: 5,
              },
            },
          },
        ],
      },
    ],
  }),
}));

test('basic rendering', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CirclesPage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  screen.getByText('Test Org');
  screen.getByText('Test Circle');
  screen.getByText('Circle Admin');
  screen.getByText('Vouching');
});
