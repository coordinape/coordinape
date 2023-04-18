// Code for use in migrating away from Recoil, that will be discarded
// once that migration is complete.
//
// If at all possible, write new code that uses Recoil only in this file.

import { useRecoilValue } from 'recoil';

import { rManifest } from 'recoilState';

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

export const useShowGive = (circleId: number) => {
  const manifest = useRecoilValue(rManifest);
  const circle = manifest.circles.find(c => c.id === circleId);
  const currentEpoch = manifest.epochs.find(
    e => e.circle_id === circleId && !e.ended
  );
  return circle?.show_pending_gives || !currentEpoch;
};

export const useIsInCircle = (circleId: number) => {
  return useRoleInCircle(circleId) !== undefined;
};
