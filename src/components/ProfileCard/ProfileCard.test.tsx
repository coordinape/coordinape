import { act, fireEvent, render, screen } from '@testing-library/react';

import { useSelectedCircle } from 'recoilState';
import { TestWrapper } from 'utils/testing';

import { ProfileCard } from './ProfileCard';

import { IUser } from 'types';

const otherUser = {
  id: 2,
  address: '0x100020003000400050006000700080009000a001',
  profile: {
    name: 'Foo',
  },
} as IUser;

const startingGift = { user: otherUser, tokens: 1, note: 'hi' };

jest.mock('hooks/useContributions');
jest.mock('recoilState');

test('allow reducing allocation to 0', async () => {
  (useSelectedCircle as jest.Mock).mockReturnValue({ circleEpochsStatus: {} });
  const mockSetGift = jest.fn();

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <ProfileCard
          user={otherUser}
          gift={startingGift}
          setGift={mockSetGift}
        />
      </TestWrapper>
    );
  });

  fireEvent.click(screen.getByTestId('decrement'));
  // do it a couple times make sure we can't go neg
  fireEvent.click(screen.getByTestId('decrement'));
  fireEvent.click(screen.getByTestId('decrement'));

  expect(mockSetGift).toHaveBeenCalledWith({ ...startingGift, tokens: 0 });
  expect(mockSetGift).toHaveBeenCalledTimes(3);
});
