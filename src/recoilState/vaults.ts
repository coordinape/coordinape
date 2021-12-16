import { atom, useRecoilCallback, useRecoilValue } from 'recoil';

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

export const useVaults = (orgId: number) => {
  return useRecoilValue(rVaults)[orgId] || [];
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
