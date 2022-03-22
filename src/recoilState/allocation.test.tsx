import { render, screen } from '@testing-library/react';
import { snapshot_UNSTABLE as getSnapshot } from 'recoil';
import { createMock } from 'ts-auto-mock';

import { ICircle } from '../types';
import { rApiFullCircle, rFullCircle, rGiftsMap } from 'recoilState';
import { TestWrapper } from 'utils/testing';

import { useAllocationStepStatus } from './allocation';

test('useAllocationStepStatus is loading', async () => {
  const TestComponent = () => {
    const [completed, nextStep] = useAllocationStepStatus(0);
    const mockCircle = createMock<ICircle>();
    return (
      <div>
        <span>{completed?.size} steps completed</span>
        <span>{nextStep?.buildLabel(mockCircle)}</span>
      </div>
    );
  };

  render(
    <TestWrapper>
      <TestComponent />
    </TestWrapper>
  );

  await screen.findByText('Loading...');
});

test('populate rGiftsMap', async () => {
  const fullCircle = {
    epochs: [],
    nominees: [],
    pending_gifts: [],
    token_gifts: [
      {
        id: 1,
        note: 'Hello world',
        tokens: 10,
        sender_id: 11,
        recipient_id: 12,
      },
    ],
    users: [
      { id: 11, name: 'Alice' },
      { id: 12, name: 'Bob' },
    ],
  };

  const snapshot = getSnapshot(({ set }) => {
    set(rApiFullCircle, () => {
      const map = new Map();
      map.set(1, fullCircle);
      return map;
    });
  });

  expect(snapshot.getLoadable(rApiFullCircle).valueMaybe()).toBeTruthy();
  expect(await snapshot.getPromise(rFullCircle)).toBeTruthy();

  const giftsMap = await snapshot.getPromise(rGiftsMap);
  expect(giftsMap.get(1)?.note).toEqual('Hello world');
});
