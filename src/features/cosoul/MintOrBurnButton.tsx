/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import { ContractReceipt } from '@ethersproject/contracts';

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
  const INITIAL_STEP = MINTING_STEPS[4];
  const { showError } = useToast();

  const [mintingStep, setMintingStep] = useState<MintingStep>(INITIAL_STEP);
  const [pendingStep, setPendingStep] = useState<MintingStep>(INITIAL_STEP);

  const [txHash, setTxHash] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ContractReceipt | null>(null);

  useEffect(() => {
    setTxHash(
      '0xfb12918d828f385be0c2bec8c0155e0b319019ea599d0a5ac14a28c5f6bcbbb6'
    );
  }, []);

  useEffect(() => {
    const rec = {
      to: '0x7A9Ec1d04904907De0ED7b6839CcdD59c3716AC9',
      from: '0x756bD520e6d52BA027E7a1b3cD59f79ab61DFC34',
      contractAddress: null,
      transactionIndex: 0,
      gasUsed: {
        type: 'BigNumber',
        hex: '0x02554a',
      },
      logsBloom:
        '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000080000000000000000000000000000000000400000008000000000000000000000000000040000000000000000000020000000000000000000800000000000000000000000010000000080080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000002000000000000000000000000000000000000400000000010000020000000000000000000000000000000000000000000000000000000000000000000',
      blockHash:
        '0x87a701000fa6a1c090c979b039f4426cac0944aa355b3097e4069cdbcfcd871b',
      transactionHash:
        '0xfb12918d828f385be0c2bec8c0155e0b319019ea599d0a5ac14a28c5f6bcbbb6',
      blockNumber: 13500045,
      confirmations: 1,
      cumulativeGasUsed: {
        type: 'BigNumber',
        hex: '0x02554a',
      },
      effectiveGasPrice: {
        type: 'BigNumber',
        hex: '0x7b3659d1',
      },
      status: 1,
      type: 2,
      byzantium: true,
    } as any as ContractReceipt;
    setReceipt(rec);
  }, []);

  // log recept
  useEffect(() => {
    if (receipt) {
      console.log(receipt);
    }
  }, [receipt]);

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
          savePending: async txHash => {
            setTxHash(txHash);
          },
          description: `Mint CoSoul`,
          signingMessage: 'Please confirm mint transaction in your wallet.',
          chainId: contracts.chainId,
          contract: contracts.cosoul,
        }
      );
      if (receipt) {
        setReceipt(receipt);
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
      {/* awaitingWallet */}
      {true && (
        <MintingModal
          currentStep={mintingStep}
          onReveal={reveal}
          receipt={receipt}
          txHash={txHash}
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
