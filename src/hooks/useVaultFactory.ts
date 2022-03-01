import assert from 'assert';

import { ZERO_ADDRESS } from 'config/constants';
import { knownTokens, TAssetEnum } from 'config/networks';
import { useApeSnackbar } from 'hooks';
import { useFakeVaultApi } from 'recoilState/vaults';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory(orgId?: number) {
  const contracts = useContracts();
  const { apeInfo, apeError } = useApeSnackbar();
  const vaultApi = useFakeVaultApi();

  const createVault = async ({
    simpleTokenAddress,
    type,
  }: {
    simpleTokenAddress?: string;
    type: TAssetEnum;
  }) => {
    assert(contracts && orgId, 'called before hooks were ready');

    try {
      const { vaultFactory } = contracts;
      assert(
        type !== 'OTHER' || simpleTokenAddress,
        'type is OTHER but no simple token address given; this should have been caught in form validation'
      );

      const args: [string, string] =
        type === 'OTHER'
          ? [ZERO_ADDRESS, simpleTokenAddress as string]
          : [contracts.getToken(type).address, ZERO_ADDRESS];

      const tx = await vaultFactory.createApeVault(...args);
      apeInfo('transaction sent');
      const receipt = await tx.wait();
      apeInfo('transaction mined');
      if (!receipt?.events) {
        apeError('VaultCreated event not found');
        return;
      }

      // TODO: support simple tokens with decimal values other than 18
      const decimals = type === 'OTHER' ? 18 : knownTokens[type].decimals;

      for (const event of receipt.events) {
        if (event?.event === 'VaultCreated') {
          const vaultAddress = event.args?.vault;
          const vault: IVault = {
            id: vaultAddress,
            transactions: [],
            tokenAddress: args[0],
            simpleTokenAddress: args[1],
            decimals,
            type,
            orgId,
          };
          vaultApi.addVault(orgId, vault);
          return vault;
        }
      }
    } catch (e) {
      console.error(e);
      apeError(e);
    }
  };

  return { createVault };
}
