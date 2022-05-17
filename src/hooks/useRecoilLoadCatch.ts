import { useRecoilCallback, CallbackInterface } from 'recoil';

import { rGlobalLoading } from 'recoilState/ui';
import { normalizeError, reportException } from 'utils/reporting';

import { useApeSnackbar } from './useApeSnackbar';

// Make an async call with access to Recoil, errors and a loading modal.
// Errors will trigger modal
//
//
// Usage:
// const mutation = async (...args) => { // Do things, update recoil ect }
// const fn = useRecoilLoadCatch((i: RecoilInterface) => {
//   // Your mutation has access to useRecoilCallback, set and get
//   return (...args) => { // Do things, update recoil ect }
// });
//
// Parameters:
//   fn: function that returns the function you want wrapped
//   deps: like useEffect, these will cause your closure to update
//   options: {
//      hideLoading: Whether to hide global loading
//      success: Message to display on success if any
//      transformError: To modify what the error modal displays
//   }
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
            let e = transformError ? transformError(err) : err;
            const normalized = normalizeError(e);
            e = normalized ?? e;
            if (
              e.message ===
              'MetaMask Message Signature: User denied message signature.'
            ) {
              apeInfo('Denied message signature.');
            } else {
              apeError(e);
              reportException(e, {
                tags: { call_point: 'useRecoilLoadCatch' },
                extra: { ...(e.code ? { code: e.code } : {}) },
              });
            }
            reject(e);
          });
      });
  }, deps);
};
