import { act, fireEvent, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { getHistoryData } from './getHistoryData';
import { HistoryPage } from './HistoryPage';

vi.mock('routes/hooks', () => ({
  useCircleIdParam: () => 1,
}));

vi.mock('features/auth/useLoginData', () => ({
  useMyUser: () => ({ id: 2 }),
}));

vi.mock('pages/HistoryPage/useReceiveInfo', () => ({
  useReceiveInfo: () => ({ showGives: false }),
}));

vi.mock('./getHistoryData', async importOriginal => {
  const { DateTime } = require('luxon'); // eslint-disable-line
  const now = DateTime.now();
  return {
    ...(await importOriginal<typeof import('./getHistoryData')>()),
    getHistoryData: async (): ReturnType<typeof getHistoryData> => ({
      token_name: 'WOOFY',
      organization: { name: 'Yearn' },
      vouching: true,
      users: [{ give_token_remaining: 77, role: 0, non_giver: false }],
      nominees_aggregate: {
        aggregate: { count: 5 },
      },
      futureEpoch: [
        {
          start_date: now.plus({ days: 7, minutes: 1 }),
          end_date: now.plus({ days: 14 }),
          repeat: 0,
          days: 7,
          id: 0,
          number: 0,
          circle_id: 0,
          ended: true,
        },
      ],
      currentEpoch: [
        {
          start_date: now.minus({ days: 6 }),
          end_date: now.plus({ hours: 1 }),
          repeat: 0,
          days: 7,
          id: 1,
          number: 0,
          circle_id: 0,
          ended: true,
        },
      ],
      pastEpochs: [
        {
          id: 3,
          start_date: now.minus({ days: 14 }),
          end_date: now.minus({ days: 7 }),
          token_gifts_aggregate: { aggregate: { sum: { tokens: 1234 } } },
          receivedGifts: [
            {
              id: 4,
              tokens: 10,
              // @ts-expect-error
              sender: null, // deleted user
              gift_private: { note: 'goodbye world' },
            },
          ],

          sentGifts: [
            {
              id: 4,
              tokens: 11,
              recipient: {
                profile: {
                  avatar: 'bob.jpg',
                  name: 'Bob',
                  address: '0x9999999999999',
                },
              },
              gift_private: { note: 'hello world' },
            },
          ],
          distributions: [],
        },
      ],
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
  await screen.findByText('Allocate Your Remaining 77 WOOFY');
  await screen.findByText('1234 WOOFY');

  fireEvent.click(screen.getByText('1 Received'));
  await screen.findByText('10 WOOFY received from Deleted User');

  fireEvent.click(screen.getByText('1 Sent'));
  await screen.findByText('11 WOOFY sent to Bob');
});
