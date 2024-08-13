// import type { JsonRpcProvider } from '@ethersproject/providers';
import create from 'zustand';

import {
  // getMagic,
  // getOptMagic,
  // KEY_MAGIC_NETWORK,
  PROVIDER_TYPE as MAGIC_PROVIDER_TYPE,
} from './magic';

export type ProviderType = typeof MAGIC_PROVIDER_TYPE;

interface AuthState {
  // provider: JsonRpcProvider | undefined;
  address: string | undefined;
  chainId: number | undefined;
  providerType: ProviderType | undefined;
  // setProvider: (
  //   provider?: JsonRpcProvider,
  //   type?: ProviderType
  // ) => Promise<void>;
  profileId: number | undefined;
  setProfileId: (profileId: number | undefined) => void;
  setAddress: (address: string | undefined) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useAuthStore = create<AuthState>((set, _get) => ({
  provider: undefined,
  address: undefined,
  chainId: undefined,
  providerType: undefined,
  // setProvider: async (provider?: JsonRpcProvider, type?: ProviderType) => {
  //   if (!provider) {
  //     if (get().providerType === 'magic') {
  //       const network = window.localStorage.getItem(KEY_MAGIC_NETWORK);
  //       if (network === 'optimism') {
  //         getOptMagic().connect.disconnect();
  //       } else {
  //         getMagic().connect.disconnect();
  //       }
  //     }
  //     set({
  //       provider: undefined,
  //       address: undefined,
  //       chainId: undefined,
  //       providerType: undefined,
  //       profileId: undefined,
  //     });
  //     return;
  //   }

  //   const [address, chainId] = await Promise.all([
  //     provider.getSigner().getAddress(),
  //     provider.getNetwork().then(n => n.chainId),
  //   ]);
  //   set({ provider, address, chainId, providerType: type });
  // },

  profileId: undefined,
  setProfileId: (profileId: number | undefined) => set({ profileId }),
  setAddress: (address: string | undefined) => set({ address }),
}));
