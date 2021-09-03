import * as Sentry from '@sentry/react';
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
  const { apeError, apeInfo } = useApeSnackbar();

  return <T>(
    call: () => Promise<T>,
    {
      hideLoading,
      success,
      reject,
    }: { hideLoading?: boolean; success?: string; reject?: boolean } = {}
  ) => {
    return new Promise<T>((resolve, reject_) => {
      !hideLoading && setGlobalLoading((v) => v + 1);
      call()
        .then((result) => {
          !hideLoading && setGlobalLoading((v) => v - 1);
          success && apeInfo(success);
          resolve(result);
        })
        .catch((e) => {
          !hideLoading && setGlobalLoading((v) => v - 1);
          apeError(e);
          Sentry.captureException(e, {
            tags: { call_point: 'useAsyncLoadCatch' },
            extra: { ...(e.code ? { code: e.code } : {}) },
          });
          if (reject) reject_(e);
        });
    });
  };
};
