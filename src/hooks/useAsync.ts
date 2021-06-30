import React, { useState, useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { rGlobalLoading } from 'recoilState';

// Making async calls error into the error boundary and have loading available.
// Inspired by
// https://medium.com/trabe/catching-asynchronous-errors-in-react-using-error-boundaries-5e8a5fd7b971
export const useAsync = () => {
  const setGlobalLoading = useSetRecoilState(rGlobalLoading);
  const [_, setError] = useState();

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
            setError(() => {
              throw e;
            });
            reject(e);
          });
      });
    },
    [setError, setGlobalLoading]
  );
};
