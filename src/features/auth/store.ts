import type { JsonRpcProvider } from '@ethersproject/providers';
import create from 'zustand';

import { getMagic } from './magic';

export type ProviderType = 'magic' | 'web3auth';
type Step = 'reuse' | 'connect' | 'sign' | 'done';

interface AuthState {
  provider: JsonRpcProvider | undefined;
  address: string | undefined;
  chainId: number | undefined;
  providerType: ProviderType | undefined;
  setProvider: (
    provider?: JsonRpcProvider,
    type?: ProviderType
  ) => Promise<void>;
  step: Step;
  setStep: (step: Step) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  provider: undefined,
  address: undefined,
  chainId: undefined,
  providerType: undefined,
  setProvider: async (provider?: JsonRpcProvider, type?: ProviderType) => {
    if (!provider) {
      if (get().providerType === 'magic') {
        getMagic().connect.disconnect();
      }
      set({
        provider: undefined,
        address: undefined,
        chainId: undefined,
        providerType: undefined,
      });
      return;
    }

    const [address, chainId] = await Promise.all([
      provider.getSigner().getAddress(),
      provider.getNetwork().then(n => n.chainId),
    ]);
    set({ provider, address, chainId, providerType: type });
  },

  step: 'reuse',
  setStep: (step: Step) => set({ step }),
}));
