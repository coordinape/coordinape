import { useRecoilValue } from 'recoil';

import { rSelectedCircleId } from 'recoilState';

import { useCircleEpoch } from './useCircleEpoch';

export const useSelectedCircleEpoch = () =>
  useCircleEpoch(useRecoilValue(rSelectedCircleId));
