import { useContext, useEffect, useState } from 'react';

import { CoLinks } from '@coordinape/contracts/typechain';
import { ChainId } from '@decent.xyz/box-common';
import { BigNumber } from '@ethersproject/bignumber';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import {
  defaultAvailableChains,
  wagmiChain,
  wagmiConfig,
} from 'features/DecentSwap/config';
import { DecentSwap } from 'features/DecentSwap/DecentSwap';
import { useQuery } from 'react-query';
import type { CSS } from 'stitches.config';
import { Address } from 'viem';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Check, Link2 } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Panel, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';
import { BridgeButton } from 'components/BridgeButton';
import { OptimismBridgeButton } from 'components/OptimismBridgeButton';
import { OrBar } from 'components/OrBar';
import { IN_PREVIEW } from 'config/env';
import { isFeatureEnabled } from 'config/features';

import { BuyButton } from './BuyButton';
import { CoLinksContext } from './CoLinksContext';
import { LinkTxProgress } from './LinkTxProgress';
import { useDoWithCoLinksContract } from './useDoWithCoLinksContract';
import { useLinkingStatus } from './useLinkingStatus';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const BuyOrSellCoLinks = ({
  subject,
  address,
  hideTitle = false,
  constrainWidth = false,
  buyOneOnly = false,
  css,
}: {
  subject: string;
  address: string;
  hideTitle?: boolean;
  constrainWidth?: boolean;
  buyOneOnly?: boolean;
  css?: CSS;
}) => {
  const { coLinksReadOnly, awaitingWallet, setAwaitingWallet } =
    useContext(CoLinksContext);
  const { balance, refresh } = useLinkingStatus({
    address,
    target: subject,
  });
  const { showError } = useToast();

  const [buyPrice, setBuyPrice] = useState<string | null>(null);
  const [buyPriceBN, setBuyPriceBN] = useState<BigNumber | null>(null);
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  const subjectIsCurrentUser = subject.toLowerCase() == address.toLowerCase();

  const [progress, setProgress] = useState('');

  const { chainId, account } = useWeb3React();
  const doWithCoLinksContract = useDoWithCoLinksContract();

  const { data: opBalance } = useQuery(
    ['balanceOf', account],
    async () => {
      if (account) {
        return await getBalance(wagmiConfig, {
          address: account as Address,
          chainId: wagmiChain.id,
        });
      }
    },
    {
      refetchInterval: 10000,
      enabled: !!account,
    }
  );
  const notEnoughBalance =
    buyPriceBN && opBalance && buyPriceBN.toBigInt() > opBalance?.value;

  const { data: subjectProfile } = useQuery(
    [QUERY_KEY_COLINKS, subject, 'profile', 'buykeys'],
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
          operationName: 'coLinks_profile_for_buyLinks',
        }
      );
      return profiles_public.pop();
    }
  );

  const syncLinks = async () => {
    await client.mutate(
      {
        syncLinks: { success: true },
      },
      {
        operationName: 'coLinks_sync_after_buysell',
      }
    );
  };

  useEffect(() => {
    if (!coLinksReadOnly) {
      return;
    }
    coLinksReadOnly
      .getBuyPriceAfterFee(subject, 1)
      .then(b => {
        setBuyPrice(ethers.utils.formatEther(b) + ' ETH');
        setBuyPriceBN(b);
      })
      .catch(e => showError('Error getting buy price: ' + e.message));
    coLinksReadOnly
      .linkSupply(subject)
      .then(b => {
        setSupply(b.toNumber());
        if (b.toNumber() > 0) {
          coLinksReadOnly
            .getSellPriceAfterFee(subject, 1)
            .then(b => setSellPrice(ethers.utils.formatEther(b) + ' ETH'))
            .catch(e => showError('Error getting sell price: ' + e.message));
        }
      })
      .catch(e => showError('Error getting supply: ' + e.message));
  }, [balance, coLinksReadOnly]);

  const sellLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    await doWithCoLinksContract(sellLinkWithContract);
  };

  const sellLinkWithContract = async (
    coLinksSigner: CoLinks,
    chainId: string
  ) => {
    try {
      setAwaitingWallet(true);
      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () => coLinksSigner.sellLinks(subject, 1),
        {
          showDefault: setProgress,
          description: `Sell CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId.toString(),
          contract: coLinksSigner,
        }
      );
      if (receipt) {
        setProgress('Done!');
        refresh();
        await syncLinks();
        setProgress('');
      } else if (error) {
        showError(error);
      } else {
        showError('no transaction receipt');
      }
    } catch (e: any) {
      showError('Error selling CoLink: ' + e.message);
    } finally {
      setAwaitingWallet(false);
    }
  };

  if (!subjectProfile) {
    return null;
  }

  if (balance === undefined) {
    return <LoadingIndicator />;
  }

  return (
    <Flex
      column
      css={{
        position: 'relative',
        width: '100%',
        gap: '$md',
        ...css,
      }}
    >
      {!hideTitle && (
        <Flex css={{ flexWrap: 'wrap', gap: '$xs' }}>
          <Link2 css={{ mr: '$xs' }} />
          <Text size={'medium'} semibold>
            You Have {balance}
          </Text>
          <Text semibold>
            {subjectProfile.name} {balance == 1 ? 'Link' : 'Links'}
          </Text>{' '}
        </Flex>
      )}
      <Flex css={{ gap: '$md' }}>
        <Flex
          css={{
            flexGrow: 1,
            gap: '$sm',
          }}
          column
        >
          <Flex
            css={{
              gap: '$md',
            }}
          >
            {buyOneOnly && balance >= 1 ? (
              <Text tag color={'complete'}>
                <Check /> You bought this Link
              </Text>
            ) : supply === 0 &&
              subject.toLowerCase() !== address.toLowerCase() ? (
              <Text size={'xs'}>
                {subjectProfile.name} hasn&apos;t opted in to CoLinks yet. They
                need to buy their own link first.
              </Text>
            ) : (
              // <Flex>
              <Flex
                css={{
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: constrainWidth ? '300px' : undefined,
                  gap: '$md',
                }}
              >
                <BuyButton
                  setProgress={setProgress}
                  onSuccess={async () => {
                    refresh();
                  }}
                  target={subject}
                  disabled={notEnoughBalance ?? false}
                />
                <Text color="complete" semibold css={{ textAlign: 'right' }}>
                  {buyPrice !== null ? buyPrice : '...'}
                </Text>
              </Flex>
            )}
          </Flex>
          {!buyOneOnly && supply !== null && supply > 0 && balance > 0 && (
            <Flex alignItems="center" css={{ gap: '$md' }}>
              <Flex
                css={{
                  justifyContent: 'space-between',
                  flexGrow: 1,
                  width: '100%',
                  maxWidth: constrainWidth ? '300px' : undefined,
                  gap: '$md',
                }}
              >
                <Button
                  onClick={sellLink}
                  disabled={
                    awaitingWallet || (supply == 1 && subjectIsCurrentUser)
                  }
                >
                  Sell Link
                </Button>
                <Text semibold color="warning" css={{ textAlign: 'right' }}>
                  {supply === 1 && subjectIsCurrentUser ? (
                    <Text
                      color="neutral"
                      semibold
                      size="small"
                    >{`Can't sell last link`}</Text>
                  ) : sellPrice !== null ? (
                    sellPrice
                  ) : (
                    '...'
                  )}
                </Text>
              </Flex>
            </Flex>
          )}
          {notEnoughBalance && opBalance && (
            <Flex column css={{ gap: '$sm', mt: '$xs' }}>
              <Text
                tag
                semibold
                css={{ textAlign: 'center' }}
                color={'warning'}
              >
                You only have{' '}
                {ethers.utils.formatEther(opBalance.value).slice(0, 6)} ETH
              </Text>
              <Panel neutral>
                <Text inline size="small" css={{ textAlign: 'center' }}>
                  Please{' '}
                  <Text inline semibold>
                    deposit more ETH
                  </Text>
                  <br />
                  to your Optimism wallet
                </Text>
                <Flex column css={{ mt: '$sm' }}>
                  {defaultAvailableChains.includes(chainId as ChainId) &&
                  (!IN_PREVIEW ||
                    (IN_PREVIEW && isFeatureEnabled('test_decent'))) ? (
                    <BridgeButton>
                      <>
                        <DecentSwap></DecentSwap>
                        <OrBar>OR</OrBar>
                        <OptimismBridgeButton />
                      </>
                    </BridgeButton>
                  ) : (
                    <OptimismBridgeButton />
                  )}
                </Flex>
              </Panel>
            </Flex>
          )}
        </Flex>
      </Flex>
      <LinkTxProgress message={progress} />
    </Flex>
  );
};
