import { act, render, screen, waitFor } from '@testing-library/react';

import { TestWrapper } from '../../utils/testing';

import CreateCirclePage from './CreateCirclePage';

jest.mock('hooks/useConnectedAddress', () => () => 'abc');

jest.mock('./queries', () => {
  return {
    getCreateCircleData: jest
      .fn()
      .mockImplementationOnce(async () => ({
        myUsers: [
          {
            name: 'abc',
            role: 0,
            circle: {
              organization: {
                id: 1,
                name: 'test',
                sample: false,
              },
            },
          },
        ],
        myProfile: {
          name: 'abc',
        },
      }))
      .mockImplementationOnce(async () => ({
        myUsers: [
          {
            name: 'abc',
            role: 1,
            circle: {
              organization: {
                id: 1,
                name: 'test',
                sample: true,
              },
            },
          },
        ],
        myProfile: {
          name: 'abc',
        },
      })),
  };
});

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
  screen.getByText('Create Circle / Create Organization');
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
  screen.getByText('Create Circle / Create Organization');
  expect(screen.queryByText('Try Out a Sample Circle')).toBeNull();
});
