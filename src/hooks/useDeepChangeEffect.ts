import { useEffect, DependencyList } from 'react';

import isEqual from 'lodash/isEqual';

import { usePrevious } from 'hooks';

/**
 * It's like useEffect but runs only when the deps list has a deep change.
 * See: {@link isEqual}.
 */
export function useDeepChangeEffect(func: () => void, deps: DependencyList) {
  const prev = usePrevious(deps);
  useEffect(() => {
    if (!prev || !isEqual(deps, prev)) {
      return func();
    }
  }, deps);
}
