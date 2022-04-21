import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';
import { mockVault, mockEpoch } from 'utils/testing/mocks';

import { DistributionsPage } from './DistributionsPage';

jest.mock('hooks/gql/useCurrentOrg', () => ({
  useCurrentOrg: jest.fn(() => [1, jest.fn()]),
}));

jest.mock('react-router-dom', () => {
  const library = jest.requireActual('react-router-dom');
  return {
    useParams: {
      epochId: '5',
    },
    ...library,
  };
});

jest.mock('hooks/gql/useVaults', () => ({
  useVaults: () => ({
    data: [mockVault],
  }),
}));

jest.mock('./queries', () => ({
  usePreviousDistributions: jest.fn().mockImplementation(() => ({
    data: {
      id: 2,
      vault_id: 2,
      distribution_json: {},
    },
  })),
  useCurrentUserForEpoch: async () => ({
    users: {
      id: 21,
      name: 'Mock User',
      address: '0x0',
      role: 1,
      circle_id: 2,
    },
  }),
  useSubmitDistribution: jest.fn(),
  useGetAllocations: jest
    .fn()
    .mockReturnValue({
      data: mockEpoch,
    })
    .mockReturnValueOnce({
      data: mockEpoch,
    })
    .mockReturnValueOnce({
      data: null,
    }),
}));

test('no epoch found', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <DistributionsPage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  screen.getByText('Sorry, epoch was not found.');
});

test('basic rendering', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <DistributionsPage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  expect(screen.getByText('Mock Circle: Epoch 4')).toBeInTheDocument();
  expect(
    screen.queryByText('Submit Distribution to Vault')
  ).toBeInTheDocument();
});
