import { act, fireEvent, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { HistoryPage } from './HistoryPage';

jest.mock('recoilState/app', () => ({
  useSelectedCircle: jest.fn(() => ({
    circle: { id: 1 },
    myUser: { id: 2 },
  })),
}));

jest.mock('./getHistoryData', () => {
  const { DateTime } = require('luxon'); // eslint-disable-line
  const now = DateTime.now();
  return {
    getHistoryData: async () => ({
      circles_by_pk: {
        token_name: 'WOOFY',
        vouching: true,
        users: [{ give_token_remaining: 77 }],
        nominees_aggregate: {
          aggregate: {
            count: 5,
          },
        },
        future: {
          epochs: [
            {
              start_date: now.plus({ days: 7, minutes: 1 }),
              end_date: now.plus({ days: 14 }),
            },
          ],
        },
        current: {
          epochs: [
            {
              start_date: now.minus({ days: 6 }),
              end_date: now.plus({ hours: 1 }),
            },
          ],
        },
        past: {
          epochs: [
            {
              id: 3,
              start_date: now.minus({ days: 14 }),
              end_date: now.minus({ days: 7 }),
              token_gifts_aggregate: { aggregate: { sum: { tokens: 1234 } } },
              received: {
                token_gifts: [
                  {
                    id: 4,
                    tokens: 10,
                    sender: null, // deleted user
                    gift_private: { note: 'goodbye world' },
                  },
                ],
              },

              sent: {
                token_gifts: [
                  {
                    id: 4,
                    tokens: 11,
                    recipient: { name: 'Bob', profile: { avatar: 'bob.jpg' } },
                    gift_private: { note: 'hello world' },
                  },
                ],
              },
              distributions: [],
            },
          ],
        },
      },
    }),
  };
});

test('basic rendering', async () => {
  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <HistoryPage />
      </TestWrapper>
    );
  });

  await screen.findByText(/starts in 7 days/);
  await screen.findByText('5 nominations');
  await screen.findByText('Allocate Your Remaining 77 WOOFY');
  await screen.findByText('1234 WOOFY');

  fireEvent.click(screen.getByText('Show More'));
  await screen.findByText('10 WOOFY received from Deleted User');

  fireEvent.click(screen.getByText('Sent'));
  await screen.findByText('11 WOOFY sent to Bob');
});
