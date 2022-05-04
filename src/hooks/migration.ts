import { useEffect } from 'react';

import debug from 'debug';
import { useRecoilValueLoadable } from 'recoil';

import { useApiBase } from 'hooks';
import { rSelectedCircle } from 'recoilState';

// this is for use in migrating away from Recoil. if you have a new page that
// doesn't use Recoil and is related to a specific circle, you may want to use
// this hook to make sure that if you then navigate away to a legacy page, that
// new page shows the correct circle.
export const useFixCircleState = (
  circleId: number | undefined,
  label: string
) => {
  const log = debug(`recoil:${label}`);
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
