import assert from 'assert';

import { ZERO_ADDRESS } from 'config/constants';
import { getToken } from 'config/networks';
import { useApeSnackbar } from 'hooks';
import { useFakeVaultApi } from 'recoilState/vaults';
import { useCurrentOrg } from 'services/api/hooks';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory() {
  const contracts = useContracts();
  const { apeInfo, apeError } = useApeSnackbar();
  const vaultApi = useFakeVaultApi();
  const currentOrg = useCurrentOrg();

  const createApeVault = async ({
    simpleTokenAddress,
    type,
  }: {
    simpleTokenAddress?: string;
    type: string;
  }) => {
    if (!contracts) {
      apeError('Contracts not loaded');
      return;
    }
    try {
      const { apeVaultFactory: factory, networkId } = contracts;
      assert(
        type !== 'OTHER' || simpleTokenAddress,
        'type is OTHER but no simple token address given; this should have been caught in form validation'
      );

      const args: [string, string] =
        type === 'OTHER'
          ? [ZERO_ADDRESS, simpleTokenAddress as string]
          : [getToken(networkId, type).address, ZERO_ADDRESS];

      const tx = await factory.createApeVault(...args);
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
            tokenAddress: args[0],
            simpleTokenAddress: args[1],
            // TODO: Use real value:
            decimals: 5,
            type,
          };
          vaultApi.addVault(currentOrg.id, vault);
          return vault;
        }
      }
    } catch (e) {
      apeError(e);
    }
  };

  return { createApeVault };
}
