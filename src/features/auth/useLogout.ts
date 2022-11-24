import { useRecoilLoadCatch } from 'hooks';

import { clearStateAfterLogout } from './useFinishAuth';

export const useLogout = () => {
  return useRecoilLoadCatch(
    ({ set }) =>
      async () =>
        clearStateAfterLogout(set),
    []
  );
};
