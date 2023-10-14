import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';

import { useToast } from '../../hooks';
import { RefreshCcw } from '../../icons/__generated';
import { Button, Flex, Image, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import { Contracts } from '../cosoul/contracts';

import { useSoulKeys } from './useSoulKeys';

export const BuyOrSellSoulKeys = ({
  contracts,
  subject,
  address,
}: {
  contracts: Contracts;
  subject: string;
  address: string;
}) => {
  const { balance, refresh } = useSoulKeys({ contracts, address, subject });
  const { showError, showSuccess } = useToast();
  const [awaitingWallet, setAwaitingWallet] = useState<boolean>(false);

  const [buyPrice, setBuyPrice] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  useEffect(() => {
    contracts.soulKeys
      .getBuyPriceAfterFee(subject, 1)
      .then(b => setBuyPrice(ethers.utils.formatEther(b) + ' ETH'));
    contracts.soulKeys
      .getSellPriceAfterFee(subject, 1)
      .then(b => setSellPrice(ethers.utils.formatEther(b) + ' ETH'));
    contracts.soulKeys.sharesSupply(subject).then(b => setSupply(b.toNumber()));
  }, [balance]);

  const buyKey = async () => {
    try {
      setAwaitingWallet(true);
      const value = await contracts.soulKeys.getBuyPriceAfterFee(subject, 1);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () =>
          contracts.soulKeys.buyShares(subject, 1, {
            value,
          }),
        {
          showDefault: showSuccess,
          showError,
          description: `Buy SoulKey`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: contracts.chainId,
          contract: contracts.soulKeys,
        }
      );
      if (receipt) {
        showSuccess('Done!');
        refresh();
      } else {
        showError('no transaction receipt');
      }
    } catch (e: any) {
      showError('Error buying soulkey: ' + e.message);
    } finally {
      setAwaitingWallet(false);
    }
  };

  const sellKey = async () => {
    try {
      setAwaitingWallet(true);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () => contracts.soulKeys.sellShares(subject, 1),
        {
          showDefault: showSuccess,
          showError,
          description: `Sell SoulKey`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: contracts.chainId,
          contract: contracts.soulKeys,
        }
      );
      if (receipt) {
        showSuccess('Done!');
        refresh();
      } else {
        showError('no transaction receipt');
      }
    } catch (e: any) {
      showError('Error selling soulkey: ' + e.message);
    } finally {
      setAwaitingWallet(false);
    }
  };

  return (
    <Flex
      css={{ gap: '$lg', borderRadius: '$3', background: '$dim', pl: '$md' }}
    >
      <Image
        css={{ width: 148, flexShrink: 0, alignSelf: 'center' }}
        src={'/imgs/soulkeys/soulkeys.png'}
      />

      <Flex
        column
        css={{
          gap: '$md',
          // border: '1px solid $cta',
          padding: '$md $md $sm $md',
        }}
      >
        <Text semibold>{supply !== null && supply + ` Keys Issued`}</Text>

        <Flex alignItems="center" css={{ gap: '$md' }}>
          <Button onClick={buyKey} color="cta" disabled={awaitingWallet}>
            Buy Key
          </Button>
          <Text size="small">{buyPrice !== null ? buyPrice : '...'}</Text>
        </Flex>
        {balance !== null && balance > 0 && (
          <Flex alignItems="center">
            {balance == 1 && subject == address ? (
              <Button disabled={true}>{`Can't Sell Last Key`}</Button>
            ) : (
              <>
                <Button onClick={sellKey} disabled={awaitingWallet}>
                  Sell Key
                </Button>
                <Text size="small">
                  {sellPrice !== null ? sellPrice : '...'}
                </Text>
              </>
            )}
          </Flex>
        )}
        <Flex alignItems="center">
          <Text semibold>You own {balance} Keys</Text>
          <Button
            color="transparent"
            onClick={refresh}
            css={{ '&:hover': { color: '$cta' } }}
          >
            <RefreshCcw />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
