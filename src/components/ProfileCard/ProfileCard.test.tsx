import { act, fireEvent, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { ProfileCard } from './ProfileCard';

import { IUser } from 'types';

const otherUser = {
  id: 2,
  address: '0x100020003000400050006000700080009000a001',
  name: 'Foo',
} as IUser;

const startingGift = { user: otherUser, tokens: 1, note: 'hi' };

jest.mock('hooks/useContributions');

test('allow reducing allocation to 0', async () => {
  const mockSetGift = jest.fn();

  const Harness = () => {
    return (
      <ProfileCard user={otherUser} gift={startingGift} setGift={mockSetGift} />
    );
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  fireEvent.click(screen.getByTestId('decrement'));
  // do it a couple times make sure we cant go neg
  fireEvent.click(screen.getByTestId('decrement'));
  fireEvent.click(screen.getByTestId('decrement'));

  expect(mockSetGift).toHaveBeenCalledWith({ ...startingGift, tokens: 0 });
  expect(mockSetGift).toHaveBeenCalledTimes(3);
});
