import assert from 'assert';

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
