import React, { useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { useQuery } from 'react-query';

import { useToast } from '../../hooks';
import { client } from '../../lib/gql/client';
import { Avatar, Button, Flex, Link, Panel, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import { Contracts } from '../cosoul/contracts';

import { useSoulKeys } from './useSoulKeys';

export const BuyOrSellSoulKeys = ({
  contracts,
  subject,
  address,
  hideName,
}: {
  contracts: Contracts;
  subject: string;
  address: string;
  hideName?: boolean;
}) => {
  const { balance, refresh } = useSoulKeys({ contracts, address, subject });
  const { showError, showSuccess } = useToast();
  const [awaitingWallet, setAwaitingWallet] = useState<boolean>(false);

  const [buyPrice, setBuyPrice] = useState<string | null>(null);
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  const subjectIsCurrentUser = subject.toLowerCase() == address.toLowerCase();

  const needsBootstrapping = subjectIsCurrentUser && balance == 0;

  const { data: subjectProfile } = useQuery(
    ['soulKeys', subject, 'profile'],
    async () => {
      const { profiles_public } = await client.query(
        {
          profiles_public: [
            {
              where: {
                address: {
                  _ilike: subject,
                },
              },
            },
            {
              id: true,
              name: true,
              avatar: true,
            },
          ],
        },
        {
          operationName: 'soulKeys_profile',
        }
      );
      return profiles_public.pop();
    }
  );

  const syncKeys = async () => {
    await client.mutate(
      {
        syncKeys: { success: true },
      },
      {
        operationName: 'soulKeys_sync_after_buysell',
      }
    );
  };

  useEffect(() => {
    contracts.soulKeys
      .getBuyPriceAfterFee(subject, 1)
      .then(b => setBuyPrice(ethers.utils.formatEther(b) + ' ETH'))
      .catch(e => showError('Error getting buy price: ' + e.message));
    contracts.soulKeys
      .sharesSupply(subject)
      .then(b => {
        setSupply(b.toNumber());
        if (b.toNumber() > 0) {
          contracts.soulKeys
            .getSellPriceAfterFee(subject, 1)
            .then(b => setSellPrice(ethers.utils.formatEther(b) + ' ETH'))
            .catch(e => showError('Error getting sell price: ' + e.message));
        }
      })
      .catch(e => showError('Error getting supply: ' + e.message));
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
        await syncKeys();
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
        await syncKeys();
      } else {
        showError('no transaction receipt');
      }
    } catch (e: any) {
      showError('Error selling soulkey: ' + e.message);
    } finally {
      setAwaitingWallet(false);
    }
  };

  if (!subjectProfile) {
    return null;
  }

  return (
    <Flex
      column
      // css={{ gap: '$lg', borderRadius: '$3', background: '$dim', p: '$md' }}
    >
      <Flex alignItems="center">
        {!hideName && (
          <Flex
            alignItems="center"
            css={
              {
                // gap: '$sm'
              }
            }
          >
            <Avatar
              size="large"
              name={subjectProfile.name}
              path={subjectProfile.avatar}
              margin="none"
              css={{ mr: '$sm' }}
            />
            <Flex column>
              <Text h2 display css={{ color: '$secondaryButtonText' }}>
                {subjectProfile.name}
              </Text>
              {!needsBootstrapping && (
                <Flex css={{ gap: '$sm' }}>
                  <Text tag color={balance == 0 ? 'warning' : 'complete'}>
                    You own {balance} Key
                    {balance == 1 ? '' : 's'}
                  </Text>
                  <Text tag color="neutral">
                    {supply !== null && supply + ` Total Keys Issued`}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        )}
        {/*<Button*/}
        {/*  color="transparent"*/}
        {/*  onClick={refresh}*/}
        {/*  css={{ '&:hover': { color: '$cta' } }}*/}
        {/*>*/}
        {/*  <RefreshCcw />*/}
        {/*</Button>*/}
      </Flex>
      <Flex css={{ gap: '$md' }}>
        <Flex
          css={{
            gap: '$md',
            // border: '1px solid $cta',
            // padding: '$md $md $sm $md',
          }}
        >
          <Flex
            alignItems="center"
            css={{
              gap: '$md',
            }}
          >
            {balance === 0 &&
            subject.toLowerCase() !== address.toLowerCase() ? (
              <Text>
                {subjectProfile.name} hasn&apos;t opted in to SoulKeys yet. They
                need to buy their own key first.
              </Text>
            ) : (
              <>
                <Button onClick={buyKey} color="cta" disabled={awaitingWallet}>
                  Buy Key
                </Button>
                <Text size="small" css={{ textAlign: 'right' }}>
                  {buyPrice !== null ? buyPrice : '...'}
                </Text>
              </>
            )}
          </Flex>
          {balance !== null && balance > 0 && (
            <Flex alignItems="center" css={{ gap: '$md' }}>
              {balance == 1 && subjectIsCurrentUser ? (
                <Button disabled={true}>{`Can't Sell Last Key`}</Button>
              ) : (
                <>
                  <Button onClick={sellKey} disabled={awaitingWallet}>
                    Sell Key
                  </Button>
                  <Text size="small" css={{ textAlign: 'right' }}>
                    {sellPrice !== null ? sellPrice : '...'}
                  </Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
      {needsBootstrapping && (
        <Panel info css={{ mt: '$lg' }}>
          <Text inline>
            <ul>
              <li>
                <strong>Buy your first key</strong> to allow other CoSoul
                holders to buy your keys.
              </li>
              <li>Your keyholders will gain access to X.</li>
              <li>You will receive Y% of the price when they buy or sell.</li>
              <li>
                <Link> Learn More about Keys</Link>
              </li>
            </ul>
          </Text>
        </Panel>
      )}
    </Flex>
  );
};
