import { useToast } from '../../hooks';
import { Button, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { deleteCosoul, mintCosoulTx } from './api/mutations';
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
          savePending: async (txHash: string) => {
            return mintCosoulTx({
              created_tx_hash: txHash,
            });
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

  const burn = async () => {
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
            return deleteCosoul(tokenId);
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
    <Button color="cta" size="large" onClick={burn}>
      Burn Your CoSoul
    </Button>
  );
};
