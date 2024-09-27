import { useContext, useEffect, useState } from 'react';

import { ChainId } from '@decent.xyz/box-common';
import { getBalance } from '@wagmi/core';
import { ethers } from 'ethers';
import { defaultAvailableChains } from 'features/DecentSwap/config';
import { DecentSwap } from 'features/DecentSwap/DecentSwap';
import { wagmiChain, wagmiConfig } from 'features/wagmi/config';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import type { CSS } from 'stitches.config';
import { Account, Address } from 'viem';
import { useAccount } from 'wagmi';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useToast } from '../../hooks';
import useProfileId from '../../hooks/useProfileId';
import { Check, Link2 } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Panel, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/viem/contractHelpers';
import { BridgeButton } from 'components/BridgeButton';
import { OptimismBridgeButton } from 'components/OptimismBridgeButton';
import { OrBar } from 'components/OrBar';
import { IN_PREVIEW } from 'config/env';
import { isFeatureEnabled } from 'config/features';
import { coLinksPaths } from 'routes/paths';
import { CoLinksWithWallet } from 'utils/viem/contracts';

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
  small = false,
  css,
}: {
  subject: string;
  address?: string;
  hideTitle?: boolean;
  constrainWidth?: boolean;
  buyOneOnly?: boolean;
  small?: boolean;
  css?: CSS;
}) => {
  const { coLinksReadOnly, awaitingWallet, setAwaitingWallet } =
    useContext(CoLinksContext);
  const { balance, refresh } = useLinkingStatus({
    address,
    target: subject,
  });
  const { showError } = useToast();

  const profileId = useProfileId(false);

  const [buyPrice, setBuyPrice] = useState<string | null>(null);
  const [buyPriceBN, setBuyPriceBN] = useState<bigint | null>(null);
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [supply, setSupply] = useState<bigint | null>(null);

  const subjectIsCurrentUser =
    address && subject.toLowerCase() == address.toLowerCase();

  const [progress, setProgress] = useState('');

  const { chainId, address: account } = useAccount();

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
  const notEnoughBalance = !!(
    buyPriceBN &&
    opBalance &&
    buyPriceBN > opBalance?.value
  );

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
    coLinksReadOnly.read
      .getBuyPriceAfterFee([subject as Address, 1n] as const)
      .then(b => {
        setBuyPrice(ethers.utils.formatEther(b) + ' ETH');
        setBuyPriceBN(b);
      })
      .catch(e => showError('Error getting buy price: ' + e.message));
    coLinksReadOnly.read
      .linkSupply([subject as Address] as const)
      .then(b => {
        setSupply(b);
        if (b > 0) {
          coLinksReadOnly.read
            .getSellPriceAfterFee([subject as Address, 1n] as const)
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
    coLinksWithWallet: CoLinksWithWallet,
    chainId: string
  ) => {
    try {
      setAwaitingWallet(true);

      const { receipt, error /*, tx*/ } = await sendAndTrackTx(
        () => {
          const args = [subject as Address, 1n] as const;
          return coLinksWithWallet.write.sellLinks(args, {
            account: account as unknown as Account,
            chain: wagmiChain,
          });
        },
        {
          showDefault: setProgress,
          description: `Sell CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId.toString(),
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

  if (!address || !profileId) {
    return (
      <Flex
        css={{
          width: '100%',
          justifyContent: 'center',
          ...(small && {
            justifyContent: 'flex-start',
          }),
        }}
      >
        <Button
          size={small ? 'xs' : 'medium'}
          as={NavLink}
          to={coLinksPaths.wizardStart}
        >
          Connect Wallet
        </Button>
      </Flex>
    );
  }

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
        gap: small ? '$sm' : '$md',
        ...css,
      }}
    >
      {!hideTitle && (
        <Flex css={{ flexWrap: 'wrap', gap: '$xs' }}>
          {!small && <Link2 css={{ mr: '$xs' }} />}
          <Text size={small ? 'small' : 'medium'} semibold>
            You Have {balance.toString()}
          </Text>
          <Text size={small ? 'small' : 'medium'} semibold>
            {subjectProfile.name} {balance == 1n ? 'Link' : 'Links'}
          </Text>{' '}
        </Flex>
      )}
      <Flex css={{ gap: '$md', ...(small && { width: '100%' }) }}>
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
            ) : (supply || 0) === 0 &&
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
                  target={subject as Address}
                  disabled={notEnoughBalance ?? false}
                  size={small ? 'xs' : 'medium'}
                />
                <Text
                  color="complete"
                  size={small ? 'small' : undefined}
                  semibold
                  css={{
                    textAlign: 'right',
                    ...(small && { color: 'inherit' }),
                  }}
                >
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
                    awaitingWallet || (supply === 1n && !!subjectIsCurrentUser)
                  }
                  size={small ? 'xs' : 'medium'}
                >
                  Sell Link
                </Button>
                <Text
                  semibold
                  color="warning"
                  size={small ? 'small' : undefined}
                  css={{
                    textAlign: 'right',
                    ...(small && { color: 'inherit' }),
                  }}
                >
                  {supply === 1n && subjectIsCurrentUser ? (
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
