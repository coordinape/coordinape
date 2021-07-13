import { useSetRecoilState } from 'recoil';

import { rGlobalLoading } from 'recoilState';

import { useApeSnackbar } from './useApeSnackbar';

// Make an async call with errors and a loading modal.
// Usage:
// const callWithLoadCatch = useAsyncLoadCatch();
// ...
// callWithLoadCatch(async () => await api.fetch(), true)
export const useAsyncLoadCatch = () => {
  const setGlobalLoading = useSetRecoilState(rGlobalLoading);
  const { apeError } = useApeSnackbar();

  return <T>(call: () => Promise<T>, hideLoading?: boolean) => {
    return new Promise<T>((resolve, reject) => {
      !hideLoading && setGlobalLoading((v) => v + 1);
      call()
        .then((result) => {
          !hideLoading && setGlobalLoading((v) => v - 1);
          resolve(result);
        })
        .catch((e) => {
          !hideLoading && setGlobalLoading((v) => v - 1);
          apeError(e);
          reject(e);
        });
    });
  };
};
