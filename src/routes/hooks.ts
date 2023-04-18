import assert from 'assert';

import { useLoginData } from 'features/auth';
import { useParams } from 'react-router-dom';

export function useCircleIdParam(required: false): number | undefined;
export function useCircleIdParam(): number;
export function useCircleIdParam(required = true) {
  const params = useParams();
  const circleId = Number(params.circleId);
  if (required) assert(circleId, 'no circle id found in params');
  return circleId ? circleId : undefined;
}

export function useOrgIdParam(required: false): number | undefined;
export function useOrgIdParam(): number;
export function useOrgIdParam(required = true) {
  const params = useParams();
  const orgId = Number(params.orgId);
  if (required) assert(orgId, 'no org id found in params');
  return orgId ? orgId : undefined;
}

export const NotReady = 'not ready';

export const useRoleInCircle = (
  circleId: number | undefined
): number | undefined | typeof NotReady => {
  const profile = useLoginData();
  if (!profile) return NotReady;
  if (!circleId) return;
  return profile.users.find(u => u.circle_id === circleId)?.role;
};

export const useCanVouch = (circleId: number): boolean | typeof NotReady => {
  const profile = useLoginData();
  if (!profile) return NotReady;
  const user = profile.users.find(u => u.circle_id === circleId);
  const circle = user?.circle;

  if (!circle?.vouching) return false;
  return !!(!user?.non_giver || !circle?.only_giver_vouch);
};

export const useIsInCircle = (circleId: number) => {
  const role = useRoleInCircle(circleId);
  if (role === NotReady) return NotReady;
  return role !== undefined;
};
