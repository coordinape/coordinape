// Code for use in migrating away from Recoil, that will be discarded
// once that migration is complete.
//
// If at all possible, write new code that uses Recoil only in this file.

import { useEffect } from 'react';

import debug from 'debug';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { useApiBase } from 'hooks';
import { rSelectedCircle, rApiManifest, rManifest } from 'recoilState';

// if you have a new page that doesn't use Recoil and is related to a specific
// circle, you may want to use this hook to make sure that if you then navigate
// away to a legacy page, that new page shows the correct circle.
export const useFixCircleState = (circleId: number | undefined) => {
  const log = debug(`useFixCircleState`);
  const recoilValue = useRecoilValueLoadable(rSelectedCircle).valueMaybe();
  const { selectCircle } = useApiBase();

  useEffect(() => {
    if (!circleId) return;
    if (circleId === recoilValue?.circle.id) {
      log(`circle ids match`);
      return;
    }

    log(`selecting circle: ${circleId}`);
    selectCircle(circleId);
  }, [circleId, recoilValue]);
};

export const useRoleInCircle = (circleId: number) => {
  const manifest = useRecoilValue(rManifest);
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
  const selectedId =
    useRecoilValueLoadable(rSelectedCircle).valueMaybe()?.circleId;
  const firstId = useRecoilValue(rApiManifest)?.myUsers[0]?.circle_id;
  return selectedId ? selectedId : firstId;
};
