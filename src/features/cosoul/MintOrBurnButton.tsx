import { useEffect, useState } from 'react';

import { MagicModalFixer } from 'features/auth/magic';
import { wagmiChain } from 'features/wagmi/config';
import { Address } from 'viem';

import { LoadingModal } from '../../components';
import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Button, Flex, HR, Text } from '../../ui';
import { sendAndTrackTx } from 'utils/viem/contractHelpers';
import { CoSoulWithWallet } from 'utils/viem/contracts';

import { chain } from './chains';
import { MINTING_STEPS, MintingModal, MintingStep } from './MintingModal';
import { useCoSoulToken } from './useCoSoulToken';

export const MintOrBurnButton = ({
  contract,
  address,
  onReveal,
}: {
  contract: CoSoulWithWallet;
  address: Address;
  onReveal(): void;
}) => {
  const { tokenId, refresh } = useCoSoulToken({ address });

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
        address={address}
        contract={contract}
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
      contract={contract}
      onMint={minted}
      onReveal={onReveal}
      address={address}
    />
  );
};

const MintButton = ({
  contract,
  address,
  onReveal,
  onMint,
}: {
  contract: CoSoulWithWallet;
  address: Address;
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
      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () => {
          return contract.write.mint({
            account: address,
            chain: wagmiChain,
          });
        },

        {
          showDefault: showProgress,
          description: `Mint CoSoul`,
          signingMessage: 'Please confirm mint transaction in your wallet.',
          chainId: chain.chainId,
        }
      );
      if (receipt) {
        onMint(receipt.transactionHash);
        showProgress();
      } else if (error) {
        showError(error);
        setAwaitingWallet(false);
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
    if (window.location.href.indexOf('cosoul') != -1) {
      history.pushState({}, 'unused', `/cosoul/${address}`);
    }
  };

  return (
    <>
      {awaitingWallet && (
        <>
          <MintingModal currentStep={mintingStep} onReveal={reveal} />
          <MagicModalFixer />
        </>
      )}
      <Button color="cta" size="large" onClick={() => mint()}>
        Mint Your CoSoul
      </Button>
    </>
  );
};

const BurnButton = ({
  contract,
  address,
  tokenId,
  onSuccess,
}: {
  contract: CoSoulWithWallet;
  tokenId: number;
  address: Address;
  onSuccess(txHash: string): void;
}) => {
  const { showDefault, showError } = useToast();

  const burn = async () => {
    try {
      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () => {
          return contract.write.burn([BigInt(tokenId)] as const, {
            account: address,
            chain: wagmiChain,
          });
        },
        {
          showDefault,
          description: `Burn CoSoul`,
          chainId: chain.chainId,
        }
      );
      if (receipt) {
        onSuccess(receipt.transactionHash);
        window.location.reload();
      } else if (error) {
        showError(error);
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
