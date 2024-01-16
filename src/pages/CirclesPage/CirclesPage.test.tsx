import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { CirclesPage } from './CirclesPage';

vi.mock('features/auth', () => ({
  useAuthStore: () => 1,
}));

vi.mock('./getOrgData', () => {
  return {
    getOrgData: async () => ({
      organizations: [
        {
          id: 1,
          name: 'Test Org',
          sample: false,
          created_by: 1,
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
          members: [
            {
              id: 3,
              profile_id: 1,
              org_id: 1,
              hidden: false,
            },
          ],
        },
      ],
    }),
  };
});

test('basic rendering', async () => {
  await act(async () => {
    render(
      <TestWrapper withWeb3>
        <CirclesPage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  screen.getByText('Test Org');
  screen.getByText('Test Circle');
  screen.getByText('Circle Admin');
  screen.getByText('Members');
});
