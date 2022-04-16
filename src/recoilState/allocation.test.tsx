import { snapshot_UNSTABLE as getSnapshot } from 'recoil';

import { rApiFullCircle, rFullCircle, rGiftsMap } from 'recoilState';

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
