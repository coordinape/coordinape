import assert from 'assert';

import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { addVault } from 'lib/gql/mutations';

import { ZERO_ADDRESS } from 'config/constants';
import { useApeSnackbar } from 'hooks';
import { Asset } from 'services/contracts';
import { sendAndTrackTx } from 'utils/contractHelpers';

import { useContracts } from './useContracts';

import { IVault } from 'types';

export function useVaultFactory(orgId?: number) {
  const contracts = useContracts();
  const { showInfo, showError } = useApeSnackbar();

  const createVault = async ({
    simpleTokenAddress,
    type,
  }: {
    simpleTokenAddress?: string;
    type?: Asset;
  }) => {
    assert(contracts && orgId, 'called before hooks were ready');

    // should be caught by form validation
    assert(
      type || simpleTokenAddress,
      'type & simple token address are both blank'
    );

    try {
      let args: [string, string], decimals: number;

      if (!type) {
        args = [ZERO_ADDRESS, simpleTokenAddress as string];
        decimals = await contracts
          .getERC20(simpleTokenAddress as string)
          .decimals();
      } else {
        const tokenAddress = contracts.getToken(type).address;
        args = [tokenAddress, ZERO_ADDRESS];
        decimals = await contracts.getERC20(tokenAddress).decimals();
      }

      const { receipt } = await sendAndTrackTx(
        () => contracts.vaultFactory.createApeVault(...args),
        { showInfo, showError }
      );

      for (const event of receipt?.events || []) {
        if (event?.event === 'VaultCreated') {
          const vaultAddress = event.args?.vault;
          //TODO: Refactor the codebase and retire the IVault interface and return the mutation result
          const vault: IVault = {
            orgId,
            tokenAddress: args[0],
            simpleTokenAddress: args[1],
            decimals,
            id: vaultAddress,
            transactions: [],
            type: type || 'OTHER',
          };

          const vaultDTO: ValueTypes['vaults_insert_input'] = {
            decimals,
            vault_address: vaultAddress,
            org_id: orgId,
            simple_token_address: args[1],
            token_address: args[0],
            symbol: type || 'OTHER',
          };
          await addVault(vaultDTO);

          return vault;
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
    }
  };

  return { createVault };
}
