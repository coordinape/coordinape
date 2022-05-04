import { act, fireEvent, render, screen } from '@testing-library/react';

import { rCircle, rLocalGift, rLocalGifts } from 'recoilState';
import { fixtures, TestWrapper, useMockRecoilState } from 'utils/testing';

import { ProfileCard } from './ProfileCard';

import { IUser } from 'types';

jest.mock('hooks/useContributions');

const otherUser = {
  id: 2,
  address: '0x100020003000400050006000700080009000a001',
  name: 'Foo',
} as IUser;

const startingGift = { user: otherUser, tokens: 1, note: 'hi' };

const snapshotState: any = {};

afterEach(() => snapshotState.release?.());

test('allow reducing allocation to 0', async () => {
  const Harness = () => {
    useMockRecoilState(snapshotState, set => {
      set(rLocalGifts(1), () => [startingGift]);
    });

    return (
      <ProfileCard
        user={otherUser}
        tokens={1}
        note="Hello world"
        circleId={fixtures.circle.id}
      />
    );
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  // there seems to be a race condition between rendering & Recoil updating.
  // this works around it
  await snapshotState.snapshot?.getPromise(rCircle(fixtures.circle.id));

  fireEvent.click(screen.getByTestId('decrement'));

  const gift = await snapshotState.snapshot?.getPromise(
    rLocalGift(otherUser.id, fixtures.circle.id)
  );
  expect(gift?.tokens).toBe(0);
  expect(gift?.note).toBe(startingGift.note);
});
