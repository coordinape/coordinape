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

export const useVaults = () => useRecoilValue(rVaults);

export const useFakeVaultApi = () => {
  const addVault = useRecoilCallback(
    ({ snapshot, set }) =>
      async (v: IVault) => {
        const vaults = await snapshot.getPromise(rVaults);
        set(rVaults, [...vaults, v]);
      },
    []
  );

  return {
    addVault,
  };
};
