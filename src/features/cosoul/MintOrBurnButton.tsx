import { useEffect, useState } from 'react';

import { LoadingModal } from '../../components';
import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button, Flex, HR, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { Contracts } from './contracts';
import { MINTING_STEPS, MintingModal, MintingStep } from './MintingModal';
import { useCoSoulToken } from './useCoSoulToken';

export const MintOrBurnButton = ({
  contracts,
  address,
  onReveal,
}: {
  contracts: Contracts;
  address: string;
  onReveal(): void;
}) => {
  const { tokenId, refresh } = useCoSoulToken({ contracts, address });

  const [syncing, setSyncing] = useState(false);

  const { showError } = useToast();

  const sync = async (txHash: string) => {
    try {
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
    await sync(txHash);
  };

  if (tokenId === null) {
    return (
      <Text tag color="secondary" css={{ mb: '$sm' }}>
        Checking CoSoul...
      </Text>
    );
  }

  if (tokenId > 0) {
    if (syncing) {
      return <LoadingModal visible={true} />;
    }
    return (
      <BurnButton
        contracts={contracts}
        tokenId={tokenId}
        onSuccess={async h => {
          refresh();
          await sync(h);
        }}
      />
    );
  }
  return (
    <MintButton
      contracts={contracts}
      onMint={minted}
      onReveal={onReveal}
      address={address}
    />
  );
};

const MintButton = ({
  contracts,
  address,
  onReveal,
  onMint,
}: {
  contracts: Contracts;
  address: string;
  onMint(txHash: string): void;
  onReveal(): void;
}) => {
  const INITIAL_STEP = MINTING_STEPS[0];
  const { showError } = useToast();

  const [mintingStep, setMintingStep] = useState<MintingStep>(INITIAL_STEP);
  const [pendingStep, setPendingStep] = useState<MintingStep>(INITIAL_STEP);

  const showProgress = (/*message: string*/) => {
    // showDefault(message);
    // advance through the little steps
    // should we delay?
    setPendingStep(prev => MINTING_STEPS[MINTING_STEPS.indexOf(prev) + 1]);
  };

  useEffect(() => {
    const idx = MINTING_STEPS.indexOf(pendingStep);
    if (idx > 1) {
      setTimeout(() => setMintingStep(pendingStep), 3000 * (idx - 1));
    } else {
      setMintingStep(pendingStep);
    }
  }, [pendingStep]);

  const [awaitingWallet, setAwaitingWallet] = useState(false);

  useEffect(() => {
    if (!awaitingWallet) {
      setPendingStep(INITIAL_STEP);
      setMintingStep(INITIAL_STEP);
    }
  }, [awaitingWallet]);

  const mint = async () => {
    try {
      setAwaitingWallet(true);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () => contracts.cosoul.mint(),
        {
          showDefault: showProgress,
          showError,
          description: `Mint CoSoul`,
          signingMessage: 'Please confirm mint transaction in your wallet.',
          chainId: contracts.chainId,
          contract: contracts.cosoul,
        }
      );
      if (receipt) {
        onMint(receipt.transactionHash);
        showProgress();
      } else {
        setAwaitingWallet(false);
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
      setAwaitingWallet(false);
    }
  };

  const reveal = () => {
    setAwaitingWallet(false);
    onReveal();
    // FIXME:  please help with a better way of rewriting the url from /cosoul/mint to /cosoul/0xAddress ... after minting
    history.pushState({}, 'unused', `/cosoul/${address}`);
  };

  return (
    <>
      {awaitingWallet && (
        <MintingModal currentStep={mintingStep} onReveal={reveal} />
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
        onSuccess(receipt.transactionHash);
        window.location.reload();
      }
    } catch (e: any) {
      showError('Error Minting: ' + e.message);
    }
  };

  return (
    <>
      <HR />
      <Flex column css={{ gap: '$md' }}>
        <Text size="small" color="alert">
          Burn your CoSoul to remove your public Coordinape reputation data.
          Burning is irreversible, and will not affect any of your private
          Coordinape data.
        </Text>
      </Flex>
      <Button color="destructive" css={{ px: '$md' }} onClick={burn}>
        Burn Your CoSoul
      </Button>
    </>
  );
};
