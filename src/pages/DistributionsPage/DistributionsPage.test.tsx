import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';
import { mockEpoch } from 'utils/testing/mocks';

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

jest.mock('./queries', () => ({
  getEpochData: jest.fn().mockImplementation(() =>
    Promise.resolve({
      number: mockEpoch.number,
      ended: true,
      circle: {
        name: mockEpoch.circle.name,
        organization: {
          vaults: [
            {
              id: 2,
              symbol: 'DAI',
              decimals: 18,
              vault_address: '0x0',
            },
          ],
        },
      },
    })
  ),
  usePreviousDistributions: jest.fn().mockImplementation(() => ({
    data: {
      id: 2,
      vault_id: 2,
      distribution_json: {},
    },
  })),
  useSubmitDistribution: jest.fn(),
}));

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
  expect(screen.getByText('Submit Distribution to Vault')).toBeInTheDocument();
});
