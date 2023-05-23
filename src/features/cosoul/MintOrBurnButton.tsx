import { useToast } from '../../hooks';
import { Button, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { Contracts } from './contracts';
import { useCoSoulToken } from './useCoSoulToken';

export const MintOrBurnButton = ({
  contracts,
  account,
}: {
  contracts: Contracts;
  account: string;
}) => {
  const { tokenId, refresh } = useCoSoulToken({ contracts, account });

  if (tokenId === null) {
    return <Text>Checking CoSoul...</Text>;
  }

  if (tokenId > 0) {
    return (
      <BurnButton contracts={contracts} tokenId={tokenId} onSuccess={refresh} />
    );
  }
  return <MintButton contracts={contracts} onSuccess={refresh} />;
};

const MintButton = ({
  contracts,
  onSuccess,
}: {
  contracts: Contracts;
  onSuccess(): void;
}) => {
  const { showDefault, showError } = useToast();

  const mint = async () => {
    try {
      const { receipt /*, tx*/ } = await sendAndTrackTx(
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
      if (receipt) {
        onSuccess();
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
    }
  };

  return (
    <Button color="cta" size="large" onClick={() => mint()}>
      Mint Your CoSoul
    </Button>
  );
};

const BurnButton = ({
  contracts,
  tokenId,
  onSuccess,
}: {
  contracts: Contracts;
  tokenId: number;
  onSuccess(): void;
}) => {
  const { showDefault, showError } = useToast();

  const mint = async () => {
    try {
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () => contracts.cosoul.burn(tokenId),
        {
          showDefault,
          showError,
          description: `Burn CoSoul`,
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
      if (receipt) {
        onSuccess();
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
    }
  };

  return (
    <Button color="cta" size="large" onClick={mint}>
      Burn Your CoSoul
    </Button>
  );
};
