import * as Sentry from '@sentry/react';
import { useRecoilCallback, CallbackInterface } from 'recoil';

import { rGlobalLoading } from 'recoilState/ui';

import { useApeSnackbar } from './useApeSnackbar';

export const useRecoilLoadCatch = <Args extends ReadonlyArray<unknown>, Return>(
  fn: (intr: CallbackInterface) => (...args: Args) => Promise<Return>,
  deps?: ReadonlyArray<unknown>,
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
  const { apeError, apeInfo } = useApeSnackbar();

  return useRecoilCallback((intr: CallbackInterface) => {
    const { set } = intr;
    const call = fn(intr);

    return (...args: Args) =>
      new Promise<Return>((resolve, reject) => {
        !hideLoading && set(rGlobalLoading, v => v + 1);
        call(...args)
          .then(result => {
            !hideLoading && set(rGlobalLoading, v => v - 1);
            success && apeInfo(success);
            resolve(result);
          })
          .catch(err => {
            !hideLoading && set(rGlobalLoading, v => v - 1);
            const e = transformError ? transformError(err) : err;
            console.error(err);
            if (
              e.message ===
              'MetaMask Message Signature: User denied message signature.'
            ) {
              apeInfo('Denied message signature.');
            } else {
              apeError(e);
              Sentry.captureException(e, {
                tags: { call_point: 'useRecoilLoadCatch' },
                extra: { ...(e.code ? { code: e.code } : {}) },
              });
            }

            reject(e);
          });
      });
  }, deps);
};
