import { useRecoilState, useSetRecoilState, RecoilState } from 'recoil';

import { rFetchedAt } from 'recoilState';

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 Minutes

// Two purposes. One is to wrap API fetching calls in a UI context so that
// errors get sent to the error boundary. Two provide a reusable way to cache
// results, until a certain amount of time has passed.
export const useRecoilFetcher = <K, V>(
  key: string,
  recoilState: RecoilState<Map<K, V>>,
  updater: (
    newValue: V | V[],
    updateWith: (update: (oldValue: Map<K, V>) => Map<K, V>) => void
  ) => void
): (<R extends V | V[]>(
  fetch: (...args: any[]) => Promise<R>,
  args?: any[],
  reset?: boolean
) => Promise<[() => void, R | undefined]>) => {
  const [fetchedAt, updateFetchedAt] = useRecoilState(rFetchedAt(key));
  const updateValue = useSetRecoilState(recoilState);

  return async <R extends V | V[]>(
    fetch: (...args: any[]) => Promise<R>,
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
        updater(result, updateValue);
        updateFetchedAt(fetchedAtMap =>
          fetchedAtMap.set(paramString, +new Date())
        );
      },
      result,
    ];
  };
};
