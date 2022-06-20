import { useRecoilState } from 'recoil';

import { rGlobalLoading } from 'recoilState/ui';
import { normalizeError, reportException } from 'utils/reporting';

import { useApeSnackbar } from './useApeSnackbar';

// useLoadAndTryMutation wraps a mutation call with global loading state and snackbar error/success handling
export const useLoadAndTryMutation = <T>(
  fn: () => T,
  { hideLoading, success }: { hideLoading?: boolean; success?: string } = {}
): (() => Promise<T | undefined>) => {
  const [, setGlobalLoading] = useRecoilState(rGlobalLoading);
  const { apeError, apeInfo } = useApeSnackbar();

  return async (): Promise<T | undefined> => {
    try {
      !hideLoading && setGlobalLoading(v => v + 1);
      const result = await fn();
      // if success is provided, notify about it
      success && apeInfo(success);
      return result;
    } catch (e) {
      const err = normalizeError(e);
      apeError(err);
      reportException(err);
    } finally {
      !hideLoading && setGlobalLoading(v => v - 1);
    }
    return undefined;
  };
};
