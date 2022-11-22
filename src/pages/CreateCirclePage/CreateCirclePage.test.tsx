import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from '../../utils/testing';

import CreateCirclePage from './CreateCirclePage';

// I made an array here and i'm shifting it per test cuz i couldn't figure out
// how to control diff results per test func with these factory funcs
// ...seems sketch -g
const mockProfileResults = [
  // first test
  {
    address: 'abc',
    myUsers: [],
  },
  // second test
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
];
jest.mock('recoilState/app', () => ({
  useMyProfile: () => mockProfileResults.shift(),
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
