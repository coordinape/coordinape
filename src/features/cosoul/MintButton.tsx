import assert from 'assert';

/* eslint-disable no-console */
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
      // TODO: do better than assert
      assert(library);
      // add and/or switch to the proper chain
      const addChain = await library.send('wallet_addEthereumChain', [chain]);
      if (addChain) {
        console.log('added chain', addChain);
      } else {
        console.log('chain already added');
      }
    } catch (e: any) {
      showError('Error Switching to ' + chain.chainName + ': ' + e.message);
    }
  };

  // enqueue a mint cosoul transaction
  const mint = async () => {
    console.log('minty clicky', chainId);
    if (chainId !== Number(chain.chainId)) {
      await addRequiredChain();
      // this triggers page refresh
    } else {
      console.log('going in to mint');
      console.log('now minting');
      try {
        console.log('tryna mint');
        // FIXME: this hangs sometimes?
        assert(contracts, 'contracts undefined');
        const { receipt, tx } = await sendAndTrackTx(
          () => contracts.cosoul.mint(),
          {
            showDefault,
            showError,
            description: `Mint CoSoul`,
            chainId: contracts.chainId,
            contract: contracts.cosoul,
            savePending: async (txHash: string) => {
              console.log('idk save the pending cosoul mint??', txHash);
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
        console.log('did da mint. receipt:', receipt, 'tx:', tx);
      } catch (e: any) {
        showError('Error Minting: ' + e.message);
      }
    }
  };
  return <Button onClick={mint}>MANTY</Button>;
};
