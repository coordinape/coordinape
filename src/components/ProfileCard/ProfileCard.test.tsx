import { useEffect } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { Snapshot, useRecoilCallback, useRecoilSnapshot } from 'recoil';

import {
  rApiFullCircle,
  rApiManifest,
  rCircle,
  rLocalGift,
  rLocalGifts,
} from 'recoilState';
import { TestWrapper } from 'utils/testing';

import { ProfileCard } from './ProfileCard';

import { IUser } from 'types';

import 'hooks/useContributions';

jest.mock('hooks/useContributions', () => ({
  useContributions: jest.fn(() => undefined),
}));

const circle = { id: 1, name: 'Test Circle' };
const profile = { address: '0x100020003000400050006000700080009000a000' };
const user = {
  id: 1,
  name: 'Me',
  address: profile.address,
  circle_id: circle.id,
};

const otherUser = {
  id: 2,
  address: user.address.replace(/0$/, '1'),
  name: 'Foo',
} as IUser;

const manifest = {
  active_epochs: [],
  circles: [circle],
  circle: {
    circle,
    epochs: [],
    nominees: [],
    pending_gifts: [],
    token_gifts: [],
    users: [],
  },
  myUsers: [user],
  profile,
};

const setupRecoilState =
  ({ set }: { set: any }) =>
  () => {
    set(rLocalGifts(1), () => [startingGift]);

    set(rApiManifest, () => manifest);

    set(rApiFullCircle, () => {
      const map = new Map();
      map.set(manifest.circle.circle.id, manifest.circle);
      return map;
    });
  };

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
    const setup = useRecoilCallback(setupRecoilState);

    useEffect(() => {
      setup();
    }, []);

    setSnapshot(useRecoilSnapshot());

    return (
      <ProfileCard
        user={otherUser}
        tokens={1}
        note="Hello world"
        circleId={1}
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

  const gift =
    snapshot &&
    (await snapshot.getPromise(rLocalGift(otherUser.id, circle.id)));
  expect(gift?.tokens).toBe(0);
  expect(gift?.note).toBe(startingGift.note);
});
