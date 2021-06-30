import { useEffect } from 'react';

import { useRecoilValue, useRecoilState } from 'recoil';

import { useConnectedWeb3Context } from 'contexts';
import {
  rLocalTeammates,
  rLocalGifts,
  rLocalGiftsInitialized,
  rPendingGifts,
  rUsersMap,
  rMyCircleUser,
  rMyProfileStaleSignal,
} from 'recoilState';
import { getApiService } from 'services/api';

import { ISimpleGift, IUser, PostTokenGiftsParam } from 'types';

export const useAllocation = (
  circleId: number
): {
  localTeammates: IUser[];
  setLocalTeammates: (teammates: IUser[]) => void;
  localGifts: ISimpleGift[];
  setLocalGifts: (gifts: ISimpleGift[]) => void;
  saveGifts: () => Promise<void>;
  saveTeammates: () => Promise<void>;
  giveTokenRemaining: number;
  givePerUser: Map<number, ISimpleGift>;
  updateGift: (id: number, params: { note?: string; tokens?: number }) => void;
} => {
  const { library: provider } = useConnectedWeb3Context();
  const [myProfileStaleSignal, setMyProfileStaleSignal] = useRecoilState(
    rMyProfileStaleSignal
  );
  const usersMap = useRecoilValue(rUsersMap);
  const pendingGifts = useRecoilValue(rPendingGifts);
  const myCircleUser = useRecoilValue(rMyCircleUser(circleId));
  const [localTeammates, setLocalTeammates] = useRecoilState(
    rLocalTeammates(circleId)
  );
  const [localGifts, setLocalGifts] = useRecoilState(rLocalGifts(circleId));
  const [localGiftsInitialized, setLocalGiftsInitialized] = useRecoilState(
    rLocalGiftsInitialized(circleId)
  );

  console.log('useAllocation:', localGifts, localTeammates);

  const giveTokenRemaining =
    (myCircleUser?.non_giver !== 0 ? 0 : myCircleUser.starting_tokens) -
    Array.from(localGifts).reduce(
      (sum, { tokens }: ISimpleGift) => sum + tokens,
      0
    );

  const givePerUser = new Map(localGifts.map((g) => [g.user.id, g]));

  useEffect(() => {
    // TODO: Does this run with the right localGiftsInitialized?
    console.log(
      'initialize setLocalGifts w',
      pendingGifts.filter((g) => g.sender_id === myCircleUser?.id)
    );
    if (!localGiftsInitialized) {
      setLocalGifts(
        pendingGifts
          .filter((g) => g.sender_id === myCircleUser?.id)
          .map(
            (g) =>
              ({
                user: usersMap.get(g.recipient_id),
                tokens: g.tokens,
                note: g.note,
              } as ISimpleGift)
          )
      );
      setLocalGiftsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGifts]);

  useEffect(() => {
    const originalSet = new Set(localGifts.map((g) => g.user.id));
    const newSet = new Set(myCircleUser?.teammates?.map((u) => u.id));
    const keepers = [] as ISimpleGift[];
    localGifts.forEach((g) => {
      if (newSet.has(g.user.id)) {
        keepers.push(g);
      }
    });
    myCircleUser?.teammates?.forEach((u) => {
      if (!originalSet.has(u.id)) {
        keepers.push({ user: u, tokens: 0, note: '' } as ISimpleGift);
      }
    });
    setLocalGifts(keepers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCircleUser]);

  const saveGifts = async () => {
    if (!myCircleUser) {
      return;
    }
    const params: PostTokenGiftsParam[] = localGifts.map(
      ({ user, tokens, note }) => ({
        tokens,
        recipient_id: user.id,
        circle_id: circleId,
        note,
      })
    );

    // TODO: how to update pending tokens for this?
    const result = await getApiService(provider).postTokenGifts(
      myCircleUser.address,
      params
    );
    console.log(result);
  };

  const saveTeammates = async () => {
    if (!myCircleUser) {
      return;
    }
    await getApiService(provider).postTeammates(
      myCircleUser.circle_id,
      myCircleUser.address,
      localTeammates.map((u) => u.id)
    );
    setMyProfileStaleSignal(myProfileStaleSignal + 1);
  };

  const updateGift = (
    id: number,
    { note, tokens }: { note?: string; tokens?: number }
  ) =>
    setLocalGifts((oldLocalGifts) => {
      const idx = oldLocalGifts.findIndex((g) => g.user.id === id);
      const original = oldLocalGifts[idx];
      const user = usersMap.get(id);
      if (!user) {
        throw `User ${id} not found in userMap`;
      }
      if (idx === -1) {
        console.log(`setting[${id}]`, tokens);
        return [
          ...oldLocalGifts,
          { user, tokens: tokens ?? 0, note: note ?? '' } as ISimpleGift,
        ];
      }
      console.log(`updating[${id}]`, original.tokens, 'with', tokens);
      const copy = localGifts.slice();
      copy[idx] = {
        user,
        tokens: tokens !== undefined ? tokens : original.tokens,
        note: note !== undefined ? note : original.note,
      };
      return copy;
    });

  return {
    localTeammates,
    setLocalTeammates,
    localGifts,
    setLocalGifts,
    saveGifts,
    saveTeammates,
    giveTokenRemaining,
    givePerUser,
    updateGift,
  };
};
