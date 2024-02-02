import { useEffect } from 'react';

import type { Contracts } from 'lib/vaults';

import { useContracts } from './useContracts';

// the callback will run not only when there's a new block, but also the first
// time the hook is run
export function useBlockListener(
  callback: (blockNumber: number, contracts: Contracts) => void,
  dependencies: any[] = []
) {
  const contracts = useContracts();
  useEffect(() => {
    if (!contracts) return;
    const wrappedCallback = (blockNumber: number) =>
      callback(blockNumber, contracts);

    contracts.provider.on('block', wrappedCallback);
    return () => {
      contracts.provider.off('block', wrappedCallback);
    };
  }, [contracts, callback, ...dependencies]);
}
