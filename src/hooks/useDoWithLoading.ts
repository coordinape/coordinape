import { useRecoilState } from 'recoil';

import { rGlobalLoading } from 'recoilState';

export const useDoWithLoading = () => {
  const [, setGlobalLoading] = useRecoilState(rGlobalLoading);

  return async <T>(callback: () => Promise<T>): Promise<T> => {
    setGlobalLoading(v => v + 1);
    try {
      const ret = await callback();
      return ret;
    } finally {
      setGlobalLoading(v => v - 1);
    }
  };
};
