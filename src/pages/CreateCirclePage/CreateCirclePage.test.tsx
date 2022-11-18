import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from '../../utils/testing';

import CreateCirclePage from './CreateCirclePage';

const mockProfileResults = [
  {
    address: 'abc',
    myUsers: [
      {
        isCircleAdmin: true,
        circle: {
          organization: {
            sample: true,
          },
        },
      },
    ],
  },
  {
    address: 'abc',
    myUsers: [],
  },
];
jest.mock('recoilState/app', () => ({
  useMyProfile: () => mockProfileResults.pop(),
}));

test('basic rendering, no sample circle yet', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateCirclePage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  screen.getByText('Get Started');
  screen.getByText('Create a Circle');
  expect(screen.queryByText('Try Out a Sample Circle')).toBeInTheDocument();
});

test('basic rendering, has sample circle', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <CreateCirclePage />
      </TestWrapper>
    );
  });

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  screen.getByText('Get Started');
  screen.getByText('Create a Circle');
  expect(screen.queryByText('Try Out a Sample Circle')).toBeNull();
});
