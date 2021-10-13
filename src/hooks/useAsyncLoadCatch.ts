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
      transformError,
    }: {
      hideLoading?: boolean;
      success?: string;
      transformError?: (e: any) => any;
    } = {}
  ) => {
    return new Promise<T>((resolve, reject) => {
      !hideLoading && setGlobalLoading(v => v + 1);
      call()
        .then(result => {
          !hideLoading && setGlobalLoading(v => v - 1);
          success && apeInfo(success);
          resolve(result);
        })
        .catch(err => {
          !hideLoading && setGlobalLoading(v => v - 1);
          const e = transformError ? transformError(err) : err;
          if (
            e.message ===
            'MetaMask Message Signature: User denied message signature.'
          ) {
            apeInfo('Denied message signature.');
          } else {
            apeError(e);
            Sentry.captureException(e, {
              tags: { call_point: 'useAsyncLoadCatch' },
              extra: { ...(e.code ? { code: e.code } : {}) },
            });
          }

          reject(e);
        });
    });
  };
};
