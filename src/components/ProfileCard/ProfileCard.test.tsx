import { useEffect } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { Snapshot, useRecoilCallback, useRecoilSnapshot } from 'recoil';

import { rCircle, rLocalGift, rLocalGifts } from 'recoilState';
import { fixtures, setupRecoilState, TestWrapper } from 'utils/testing';

import { ProfileCard } from './ProfileCard';

import { IUser } from 'types';

jest.mock('hooks/useContributions');

const otherUser = {
  id: 2,
  address: '0x100020003000400050006000700080009000a001',
  name: 'Foo',
} as IUser;

const startingGift = { user: otherUser, tokens: 1, note: 'hi' };

test('allow reducing allocation to 0', async () => {
  let snapshot: Snapshot | undefined;
  let release: () => void;

  const setSnapshot = (s: Snapshot) => {
    if (s && s !== snapshot) {
      if (release) release();
      snapshot = s;
      release = snapshot.retain();
    }
  };

  const Harness = () => {
    const setup = useRecoilCallback(({ set }) => () => {
      setupRecoilState(set);
      set(rLocalGifts(1), () => [startingGift]);
    });

    useEffect(() => {
      setup();
    }, []);

    setSnapshot(useRecoilSnapshot());

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
  await snapshot?.getPromise(rCircle(1));

  fireEvent.click(screen.getByTestId('decrement'));

  const gift = await snapshot?.getPromise(
    rLocalGift(otherUser.id, fixtures.circle.id)
  );
  expect(gift?.tokens).toBe(0);
  expect(gift?.note).toBe(startingGift.note);
});
