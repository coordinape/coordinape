import { useState } from 'react';

import { useNavigate } from 'react-router';

import { LoadingModal } from '../../components';
import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import { paths } from 'routes/paths';

import { Contracts } from './contracts';
import { useCoSoulToken } from './useCoSoulToken';

export const MintOrBurnButton = ({
  contracts,
  address,
  onMint,
}: {
  contracts: Contracts;
  address: string;
  onMint(): void;
}) => {
  const { tokenId, refresh } = useCoSoulToken({ contracts, address });

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

  const minted = async (txHash: string) => {
    onMint();
    await sync(txHash);
  };

  if (syncing) {
    return <LoadingModal visible={true} />;
  }

  if (tokenId === null) {
    return (
      <Text tag color="secondary" css={{ mb: '$sm' }}>
        Checking CoSoul...
      </Text>
    );
  }

  if (tokenId > 0) {
    return (
      <BurnButton contracts={contracts} tokenId={tokenId} onSuccess={sync} />
    );
  }
  return (
    <MintButton contracts={contracts} onSuccess={minted} address={address} />
  );
};

const MintButton = ({
  contracts,
  address,
  onSuccess,
}: {
  contracts: Contracts;
  address: string;
  onSuccess(txHash: string): void;
}) => {
  const { showDefault, showError } = useToast();

  const [awaitingWallet, setAwaitingWallet] = useState(false);

  const mint = async () => {
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
        onSuccess(receipt.transactionHash);
        // FIXME:  please help with a better way of rewriting the url from /cosoul/mint to /cosoul/0xAddress ... after minting
        history.pushState({}, 'unused', `/cosoul/${address}`);
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
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
  const navigate = useNavigate();

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
        onSuccess(receipt.transactionHash);
        navigate(paths.mint);
        window.location.reload();
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
    }
  };

  return (
    <Button color="destructive" css={{ px: '$md' }} onClick={burn}>
      Burn Your CoSoul
    </Button>
  );
};
