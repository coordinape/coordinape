// Code for use in migrating away from Recoil, that will be discarded
// once that migration is complete.
//
// If at all possible, write new code that uses Recoil only in this file.

import { useEffect, useState } from 'react';

import { useRecoilValue, useRecoilState, useRecoilValueLoadable } from 'recoil';

import { DebugLogger } from '../common-lib/log';
import { useFetchCircle } from 'hooks/legacyApi';
import {
  rSelectedCircleId,
  rApiManifest,
  rManifest,
  rApiFullCircle,
  rSelectedCircleIdSource,
} from 'recoilState';

const logger = new DebugLogger('hooks/migration');

// if you have a new page that doesn't use Recoil and is related to a specific
// circle, you may want to use this hook to make sure that if you then navigate
// away to a legacy page, that new page shows the correct circle.
export const useFixCircleState = (circleId: number | undefined) => {
  const recoilCircleId = useRecoilValueLoadable(rSelectedCircleId).valueMaybe();
  const fullCircles = useRecoilValue(rApiFullCircle);
  const [, setCircleIdSource] = useRecoilState(rSelectedCircleIdSource);
  const fetchCircle = useFetchCircle();
  logger.log(`useFixCircleState, circle id: ${circleId}`);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!circleId) {
      setReady(true);
      return;
    }

    if (circleId === recoilCircleId) {
      logger.log(`circle ids match`);
      setReady(true);
    } else if (fullCircles.has(circleId)) {
      logger.log(`reusing circle data: ${circleId}`);
      setCircleIdSource(circleId);
      setReady(true);
    } else {
      logger.log(`fetching circle data: ${circleId}`);
      fetchCircle({ circleId, select: true }).then(() => setReady(true));
    }
  }, [circleId, recoilCircleId]);

  return ready;
};

export const useRoleInCircle = (circleId: number | undefined) => {
  const manifest = useRecoilValue(rManifest);
  if (!circleId) return;
  const user = manifest.myProfile.myUsers.find(u => u.circle_id === circleId);
  return user?.role;
};

export const useCanVouch = (circleId: number) => {
  const manifest = useRecoilValue(rManifest);
  const user = manifest.myProfile.myUsers.find(u => u.circle_id === circleId);
  const circle = manifest.circles.find(c => c.id === circleId);
  return !(user?.non_giver && circle?.only_giver_vouch) && circle?.hasVouching;
};

export const useHasCircles = () =>
  (useRecoilValueLoadable(rApiManifest).valueMaybe()?.circles.length ?? 0) > 0;

export const useSomeCircleId = () => {
  const selectedId = useRecoilValueLoadable(rSelectedCircleId).valueMaybe();
  const firstId = useRecoilValue(rApiManifest)?.myUsers[0]?.circle_id;
  return selectedId ?? firstId;
};

export const useShowGive = (circleId: number) => {
  const manifest = useRecoilValue(rManifest);
  const circle = manifest.circles.find(c => c.id === circleId);
  const currentEpoch = manifest.epochs.find(
    e => e.circle_id === circleId && !e.ended
  );
  return circle?.show_pending_gives || !currentEpoch;
};

export const useIsInCircle = (circleId: number) => {
  const manifest = useRecoilValue(rManifest);
  const user = manifest.myProfile.myUsers.find(u => u.circle_id === circleId);
  return !!user?.role;
};
