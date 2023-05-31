/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from 'assert';
import { useEffect, useState } from 'react';

import { TypedEvent } from '@coordinape/hardhat/dist/typechain/commons';
import { BigNumber } from 'ethers';
import { provider } from 'lib/zod/formHelpers';
import { useQuery } from 'react-query';

import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
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
  return (
    <MintButton contracts={contracts} onSuccess={refresh} account={account} />
  );
};

const MintButton = ({
  contracts,
  onSuccess,
  account,
}: {
  contracts: Contracts;
  onSuccess(): void;
  account: string;
}) => {
  const { showDefault, showError } = useToast();

  const [mintedBlockNumber, setMintedBlockNumber] = useState<
    number | undefined
  >(undefined);

  const { data, isLoading, isError, error } = useQuery(
    ['mintEvents', account],
    async (): Promise<any> => {
      assert(mintedBlockNumber);
      console.log({ mintedBlockNumber });
      return getMintEvents(contracts, {
        deployment_block: mintedBlockNumber,
        profile_address: account,
      });
    },
    {
      enabled: !!mintedBlockNumber,
      retry: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  useEffect(() => {
    console.log({ data, isLoading, isError, error });
  }, [data, isLoading, isError, error]);

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
        setMintedBlockNumber(receipt.blockNumber);
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

interface RawTransaction {
  block: number;
  date: string;
  type: string;
  details: string;
  hash: string;
}

async function getMintEvents(
  contracts: Contracts,
  {
    deployment_block,
    profile_address,
  }: {
    deployment_block: number;
    profile_address: string;
  }
): Promise<any> {
  const mintEvents = await contracts.cosoul.queryFilter(
    contracts.cosoul.filters.Transfer(null, profile_address),
    deployment_block
  );

  console.log('mintEvents', mintEvents);

  return [];
}
