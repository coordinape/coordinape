import assert from 'assert';

import { ZERO_ADDRESS } from 'config/constants';
import { TAssetEnum } from 'config/networks';
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

      let args: [string, string], decimals: number;

      if (type === 'OTHER') {
        args = [ZERO_ADDRESS, simpleTokenAddress as string];
        decimals = await contracts
          .getERC20(simpleTokenAddress as string)
          .decimals();
      } else {
        const tokenAddress = contracts.getToken(type).address;
        args = [tokenAddress, ZERO_ADDRESS];
        decimals = await contracts.getERC20(tokenAddress).decimals();
      }

      const tx = await vaultFactory.createApeVault(...args);
      apeInfo('transaction sent');
      const receipt = await tx.wait();
      apeInfo('transaction mined');

      for (const event of receipt?.events || []) {
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

      throw new Error('VaultCreated event not found');
    } catch (e) {
      console.error(e);

      if ((e as any).message?.match(/method=.decimals/)) {
        apeError(
          "The custom asset must be an ERC20 token. (Couldn't call the decimals() method)"
        );
      } else {
        apeError(e);
      }
    }
  };

  return { createVault };
}
