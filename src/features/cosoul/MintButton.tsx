import assert from 'assert';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Button } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { chain } from './chains';
import { useCoSoulContracts } from './useCoSoulContracts';

export const MintButton = () => {
  const { library, chainId } = useWeb3React();
  const contracts = useCoSoulContracts();
  const { showDefault, showError } = useToast();

  const addRequiredChain = async () => {
    try {
      assert(library);
      // add and/or switch to the proper chain
      await library.send('wallet_addEthereumChain', [chain]);
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };

  // enqueue a mint cosoul transaction
  const mint = async () => {
    if (chainId !== Number(chain.chainId)) {
      await addRequiredChain();
      // this triggers page refresh
    } else {
      try {
        assert(contracts, 'contracts undefined');
        /*const { receipt, tx } = */ await sendAndTrackTx(
          () => contracts.cosoul.mint(),
          {
            showDefault,
            showError,
            description: `Mint CoSoul`,
            chainId: contracts.chainId,
            contract: contracts.cosoul,
            savePending: async (/*txHash: string*/) => {
              // FIXME: lets do something here
              // if (setTxHash) setTxHash(txHash);
              // return savePendingVaultTx({
              //   tx_hash: txHash,
              //   org_id: orgId,
              //   chain_id: Number.parseInt(contracts.chainId),
              //   tx_type: vault_tx_types_enum.Vault_Deploy,
              // });
            },
          }
        );
      } catch (e: any) {
        showError('Error Minting: ' + e.message);
      }
    }
  };
  return (
    <Button color="cta" size="large" onClick={mint}>
      Mint Your CoSoul
    </Button>
  );
};
