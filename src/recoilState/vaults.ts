import { useEffect, useState } from 'react';

import { atom, useRecoilValue, useRecoilCallback } from 'recoil';

import { useContracts } from 'hooks/useContracts';
import storage from 'utils/storage';

import { IVault } from 'types';

export const rVaults = atom({
  key: 'rVaults',
  default: storage.getVaults(),
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet(vaults => {
        storage.setVaults(vaults);
      });
    },
  ],
});

export const useVaults = (orgId: number | undefined) => {
  const vaults = useRecoilValue(rVaults);
  const [orgVaults, setOrgVaults] = useState(orgId ? vaults[orgId] : []);

  // look up custom vault symbols from chain.
  // maybe in the future we can just store this in the DB instead
  const contracts = useContracts();
  useEffect(() => {
    if (!contracts) return;
    (async () => {
      for (const vault of Object.values(orgVaults)) {
        if (vault.type !== 'OTHER') {
          vault.symbol = vault.type;
        } else {
          vault.symbol = await contracts
            .getERC20(vault.simpleTokenAddress)
            .symbol();
        }
      }
      setOrgVaults([...orgVaults]);
    })();
  }, [contracts]);

  return orgVaults;
};

export const useFakeVaultApi = () => {
  const addVault = useRecoilCallback(
    ({ snapshot, set }) =>
      async (orgId: number, v: IVault) => {
        const vaults = await snapshot.getPromise(rVaults);
        set(rVaults, {
          ...vaults,
          [orgId]: [...(vaults[orgId] || []), v],
        });
      },
    []
  );

  return {
    addVault,
  };
};
