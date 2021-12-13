import { useApeSnackbar } from 'hooks';
import { useFakeVaultApi } from 'recoilState/vaults';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory() {
  const contracts = useContracts();
  const { apeInfo, apeError } = useApeSnackbar();
  const vaultApi = useFakeVaultApi();

  const createApeVault = async ({
    tokenAddress,
    simpleTokenAddress,
    type,
  }: {
    tokenAddress: string;
    simpleTokenAddress: string;
    type: string;
  }) => {
    if (!contracts) {
      apeError('Contracts not loaded');
      return;
    }
    try {
      const { apeVaultFactory: factory } = contracts;
      const tx = await factory.createApeVault(tokenAddress, simpleTokenAddress);
      apeInfo('transaction sent');
      const receipt = await tx.wait();
      apeInfo('transaction mined');
      if (!receipt?.events) {
        apeError('VaultCreated event not found');
        return;
      }

      for (const event of receipt.events) {
        if (event?.event === 'VaultCreated') {
          const vaultAddress = event.args?.vault;
          const vault: IVault = {
            id: vaultAddress,
            transactions: [],
            tokenAddress,
            simpleTokenAddress,
            // TODO: Use real value:
            decimals: 5,
            type,
          };
          vaultApi.addVault(vault);
          return vault;
        }
      }
    } catch (e) {
      apeError(e);
    }
  };

  return { createApeVault };
}
