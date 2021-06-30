import { useRecoilValue } from 'recoil';

import { rSelectedCircleId } from 'recoilState';

import { useAllocation } from './useAllocation';

export const useSelectedAllocation = () =>
  useAllocation(useRecoilValue(rSelectedCircleId));
