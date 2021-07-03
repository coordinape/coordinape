import { useRecoilState, useSetRecoilState, RecoilState } from 'recoil';

import { rFetchedAt } from 'recoilState';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 Minutes

type TFetchUpdater = (
  newValue: any,
  updateWith: (update: (oldValue: any) => any) => void
) => void;

// Two purposes. One is to wrap API fetching calls in a UI context so that
// errors get sent to the error boundary. Two provide a reusable way to cache
// results, until a certain amount of time has passed.
export const useRecoilFetcher = (
  key: string,
  recoilState: RecoilState<any>,
  updater?: TFetchUpdater
): ((
  fetch: (...args: any[]) => Promise<any>,
  args?: any[],
  reset?: boolean
) => Promise<[() => void, any]>) => {
  const [fetchedAt, updateFetchedAt] = useRecoilState(rFetchedAt(key));
  const updateValue = useSetRecoilState(recoilState);

  return async (
    fetch: (...args: any[]) => Promise<any>,
    args?: any[],
    reset?: boolean
  ): Promise<[() => void, any]> => {
    // [commit, result] = fetchIfNeeded(fetch, args, reset)
    const paramString = JSON.stringify(args);
    const elapsed = +new Date() - (fetchedAt.get(paramString) ?? 0);
    if (!reset && STALE_THRESHOLD_MS > elapsed) {
      return [() => undefined, undefined];
    }
    const result = await fetch(...(args ?? []));
    return [
      () => {
        // Commit
        if (updater) {
          updater(result, updateValue);
        } else {
          updateValue(result);
        }
        updateFetchedAt((fetchedAtMap) =>
          fetchedAtMap.set(paramString, +new Date())
        );
      },
      result,
    ];
  };
};
