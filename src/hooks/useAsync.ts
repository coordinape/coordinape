import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { rGlobalLoading } from 'recoilState';

import { useApeSnackbar } from './useApeSnackbar';

// Making async calls with errors and loading
export const useAsync = () => {
  const setGlobalLoading = useSetRecoilState(rGlobalLoading);
  const { apeError } = useApeSnackbar();

  return useCallback(
    async <T>(promise: Promise<T>, showLoading: boolean) => {
      return new Promise<T>((resolve, reject) => {
        showLoading && setGlobalLoading((v) => v + 1);
        promise
          .then((result) => {
            showLoading && setGlobalLoading((v) => v - 1);
            resolve(result);
          })
          .catch((e) => {
            showLoading && setGlobalLoading((v) => v - 1);
            apeError(e);
            reject(e);
          });
      });
    },
    [setGlobalLoading, apeError]
  );
};
