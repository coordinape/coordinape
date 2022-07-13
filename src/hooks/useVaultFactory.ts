import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { addVault } from 'lib/gql/mutations';
import { Asset } from 'lib/vaults';

import { ZERO_ADDRESS } from 'config/constants';
import { useApeSnackbar } from 'hooks';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useContracts } from './useContracts';

export function useVaultFactory(orgId?: number) {
  const contracts = useContracts();
  const { showInfo, showError } = useApeSnackbar();

  const createVault = async ({
    simpleTokenAddress,
    type,
    customSymbol,
  }: {
    simpleTokenAddress?: string;
    type?: Asset;
    customSymbol?: string;
  }) => {
    assert(contracts && orgId, 'called before hooks were ready');

    // should be caught by form validation
    assert(
      type || simpleTokenAddress,
      'type & simple token address are both blank'
    );

    try {
      let args: [string, string];

      if (!type) {
        args = [ZERO_ADDRESS, simpleTokenAddress as string];
      } else {
        const tokenAddress = contracts.getToken(type).address;
        args = [tokenAddress, ZERO_ADDRESS];
      }

      const { receipt } = await sendAndTrackTx(
        () => contracts.vaultFactory.createApeVault(...args),
        {
          showInfo,
          showError,
          description: `Create ${type || customSymbol} Vault`,
          chainId: contracts.chainId,
        }
      );

      for (const event of receipt?.events || []) {
        if (event?.event === 'VaultCreated') {
          const vaultAddress = event.args?.vault;

          const vault: ValueTypes['CreateVaultInput'] = {
            vault_address: vaultAddress,
            org_id: orgId,
            chain_id: Number.parseInt(contracts.chainId),
            deployment_block: receipt?.blockNumber || 0,
          };

          const { createVault } = await addVault(vault);
          return createVault?.vault;
        }
      }

      if (receipt) throw new Error('VaultCreated event not found');
    } catch (e) {
      console.error(e);

      if ((e as any).message?.match(/method=.decimals/)) {
        showError(
          "The custom asset must be an ERC20 token. (Couldn't call the decimals() method)"
        );
      } else {
        showError(e);
      }

      return null;
    }
  };

  return { createVault };
}
