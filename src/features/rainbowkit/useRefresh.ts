import { useState, useEffect } from 'react';

import { refreshEmitter } from './refreshEmitter';

export function useRefresh(): number {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = refreshEmitter.subscribe(() => {
      setRefreshKey(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  return refreshKey;
}
