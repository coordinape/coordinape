import { useState } from 'react';

import { LoadingModal } from '../../components';
import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { addInteractionEvent } from './addInteractionEvent';
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

  const [syncing, setSyncing] = useState(false);

  const { showError } = useToast();

  const sync = async (txHash: string) => {
    try {
      refresh();
      // TODO: show that we are syncing?
      setSyncing(true);
      await client.mutate(
        {
          syncCoSoul: [
            {
              payload: {
                tx_hash: txHash,
              },
            },
            {
              token_id: true,
            },
          ],
        },
        {
          operationName: 'syncCoSoul',
        }
      );
    } catch (e: any) {
      showError('Error Syncing CoSoul: ' + e.message);
    } finally {
      setSyncing(false);
    }
  };

  if (syncing) {
    return <LoadingModal visible={true} />;
  }

  if (tokenId === null) {
    return <Text>Checking CoSoul...</Text>;
  }

  if (tokenId > 0) {
    return (
      <BurnButton contracts={contracts} tokenId={tokenId} onSuccess={sync} />
    );
  }
  return <MintButton contracts={contracts} onSuccess={sync} />;
};

const MintButton = ({
  contracts,
  onSuccess,
}: {
  contracts: Contracts;
  onSuccess(txHash: string): void;
}) => {
  const { showDefault, showError } = useToast();

  const [awaitingWallet, setAwaitingWallet] = useState(false);

  const mint = async () => {
    await addInteractionEvent({
      event_type: 'mint_cosoul_clicked',
      data: { chainId: contracts.chainId },
    });

    try {
      setAwaitingWallet(true);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () => contracts.cosoul.mint(),
        {
          showDefault,
          showError,
          description: `Mint CoSoul`,
          signingMessage: 'Please confirm mint transaction in your wallet.',
          chainId: contracts.chainId,
          contract: contracts.cosoul,
        }
      );
      if (receipt) {
        await addInteractionEvent({
          event_type: 'mint_cosoul_success',
          data: { chainId: contracts.chainId },
        });
        onSuccess(receipt.transactionHash);
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
      await addInteractionEvent({
        event_type: 'mint_cosoul_failure',
        data: { chainId: contracts.chainId },
      });
    } finally {
      setAwaitingWallet(false);
    }
  };

  return (
    <>
      {awaitingWallet && (
        <LoadingModal
          visible={true}
          note="Please complete transaction in your wallet."
        />
      )}
      <Button color="cta" size="large" onClick={() => mint()}>
        Mint Your CoSoul
      </Button>
    </>
  );
};

const BurnButton = ({
  contracts,
  tokenId,
  onSuccess,
}: {
  contracts: Contracts;
  tokenId: number;
  onSuccess(txHash: string): void;
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
        }
      );
      if (receipt) {
        await addInteractionEvent({
          event_type: 'burn_cosoul_success',
          data: { chainId: contracts.chainId },
        });
        onSuccess(receipt.transactionHash);
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
      await addInteractionEvent({
        event_type: 'burn_cosoul_failure',
        data: { chainId: contracts.chainId },
      });
    }
  };

  return (
    <Button color="cta" size="large" onClick={burn}>
      Burn Your CoSoul
    </Button>
  );
};
