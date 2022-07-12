import { act, render, screen, waitFor } from '@testing-library/react';
import { FixedNumber } from 'ethers';

import { TestWrapper } from 'utils/testing';
import { mockEpoch } from 'utils/testing/mocks';

import { DistributionsPage } from './DistributionsPage';
import { getEpochData } from './queries';

jest.mock('recoilState/app', () => ({
  useSelectedCircle: jest.fn(() => ({
    circle: { id: 2 },
    users: mockEpoch.circle.users,
  })),
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

const mockEpochData = {
  id: 1,
  number: mockEpoch.number,
  ended: true,
  circle: {
    name: mockEpoch.circle.name,
    users: [{ role: 1 }],
    fixed_payment_token_type: 'USDC',
    organization: {
      vaults: [
        {
          id: 2,
          symbol: 'USDC',
          decimals: 6,
          vault_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        },
      ],
    },
  },
  token_gifts: [
    {
      tokens: 100,
      recipient: {
        id: 21,
        name: 'foo',
        address: '0x63c389CB2C573dd3c9239A13a3eb65935Ddb5e2e',
        profile: {
          avatar: 'fooface.jpg',
        },
      },
    },
  ],
  distributions: [],
};

jest.mock('./queries', () => ({
  getEpochData: jest.fn(),
  usePreviousDistributions: jest.fn().mockImplementation(() => ({
    data: {
      id: 2,
      vault_id: 2,
      distribution_json: {},
    },
  })),
  useSubmitDistribution: jest.fn(),
}));

test('render without a distribution', async () => {
  (getEpochData as any).mockImplementation(() =>
    Promise.resolve(mockEpochData)
  );

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
  expect(screen.getByText('Insufficient Tokens')).toBeInTheDocument();
});

test('render with a distribution', async () => {
  (getEpochData as any).mockImplementation(() =>
    Promise.resolve({
      ...mockEpochData,
      distributions: [
        {
          created_at: '2022-04-27T00:28:03.27622',
          total_amount: 10000000,
          pricePerShare: FixedNumber.from('1.08'),
          distribution_type: 1,
          vault: {
            id: 2,
            decimals: 6,
            symbol: 'USDC',
          },
          claims: [
            {
              new_amount: 10.8,
              user: {
                id: 21,
              },
            },
          ],
        },
      ],
    })
  );

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
  expect(screen.getByText('10.80 USDC')).toBeInTheDocument();
});
