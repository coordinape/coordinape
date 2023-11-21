import assert from 'assert';
import { useContext, useEffect, useState } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import { useQuery, useQueryClient } from 'react-query';
import type { CSS } from 'stitches.config';

import { LoadingIndicator } from '../../components/LoadingIndicator';
import { useToast } from '../../hooks';
import { useWeb3React } from '../../hooks/useWeb3React';
import { Check, Link2 } from '../../icons/__generated';
import { client } from '../../lib/gql/client';
import { Button, Flex, Link, Text } from '../../ui';
import { sendAndTrackTx } from '../../utils/contractHelpers';

import { CoLinksContext } from './CoLinksContext';
import { useCoLinks } from './useCoLinks';
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
  const { coLinks, chainId } = useContext(CoLinksContext);
  const { balance, refresh } = useCoLinks({
    contract: coLinks,
    address,
    target: subject,
  });
  const { showError } = useToast();
  const [awaitingWallet, setAwaitingWallet] = useState<boolean>(false);

  const [buyPrice, setBuyPrice] = useState<string | null>(null);
  const [buyPriceBN, setBuyPriceBN] = useState<BigNumber | null>(null);
  const [sellPrice, setSellPrice] = useState<string | null>(null);
  const [supply, setSupply] = useState<number | null>(null);

  const subjectIsCurrentUser = subject.toLowerCase() == address.toLowerCase();

  const [progress, setProgress] = useState('');

  const { library, account } = useWeb3React();

  const { data: opBalance } = useQuery(
    ['balanceOf', account],
    async () => {
      if (account) {
        return await library?.getBalance(account);
      }
    },
    {
      refetchInterval: 10000,
      enabled: !!account,
    }
  );

  const notEnoughBalance = buyPriceBN && opBalance && buyPriceBN?.gt(opBalance);

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
    if (!coLinks) {
      return;
    }
    coLinks
      .getBuyPriceAfterFee(subject, 1)
      .then(b => {
        setBuyPrice(ethers.utils.formatEther(b) + ' ETH');
        setBuyPriceBN(b);
      })
      .catch(e => showError('Error getting buy price: ' + e.message));
    coLinks
      .linkSupply(subject)
      .then(b => {
        setSupply(b.toNumber());
        if (b.toNumber() > 0) {
          coLinks
            .getSellPriceAfterFee(subject, 1)
            .then(b => setSellPrice(ethers.utils.formatEther(b) + ' ETH'))
            .catch(e => showError('Error getting sell price: ' + e.message));
        }
      })
      .catch(e => showError('Error getting supply: ' + e.message));
  }, [balance, coLinks]);

  const queryClient = useQueryClient();
  const buyKey = async () => {
    try {
      assert(coLinks);
      assert(chainId);
      setAwaitingWallet(true);
      const value = await coLinks.getBuyPriceAfterFee(subject, 1);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () =>
          coLinks.buyLinks(subject, 1, {
            value,
          }),
        {
          showDefault: setProgress,
          showError,
          description: `Buy CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId.toString(),
          contract: coLinks,
        }
      );
      if (receipt) {
        setProgress('Done!');
        refresh();
        await syncLinks();
        queryClient.invalidateQueries([QUERY_KEY_COLINKS, address]);
      } else {
        showError('no transaction receipt');
      }
    } catch (e: any) {
      showError('Error buying CoLink: ' + e.message);
    } finally {
      setAwaitingWallet(false);
    }
  };

  const sellKey = async () => {
    try {
      assert(coLinks);
      assert(chainId);
      setAwaitingWallet(true);
      const { receipt /*, tx*/ } = await sendAndTrackTx(
        () => coLinks.sellLinks(subject, 1),
        {
          showDefault: setProgress,
          showError,
          description: `Sell CoLink`,
          signingMessage: 'Please confirm transaction in your wallet.',
          chainId: chainId.toString(),
          contract: coLinks,
        }
      );
      if (receipt) {
        setProgress('Done!');
        refresh();
        await syncLinks();
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
        <Text size={'medium'} semibold css={{ gap: '$sm' }}>
          <Link2 /> You Have {subjectProfile.name} Links
        </Text>
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
              <Text>
                {subjectProfile.name} hasn&apos;t opted in to CoLinks yet. They
                need to buy their own key first.
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
                <Button
                  size={'medium'}
                  onClick={buyKey}
                  color="cta"
                  disabled={awaitingWallet || notEnoughBalance}
                >
                  Buy Link
                </Button>
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
                  onClick={sellKey}
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
            <Flex
              css={{
                alignItems: 'center',
                gap: '$sm',
                p: '$md',
                m: '$md -$md 0',
                background: '$tagNeutralBackground',
                color: '$tagNeutralText',
                borderRadius: '$3',
              }}
              column
            >
              <Flex>
                <Text size={'small'} semibold>
                  You only have{' '}
                  {ethers.utils.formatEther(opBalance).slice(0, 6)} ETH -
                  Deposit more to buy.
                </Text>
              </Flex>
              <Button
                size="xs"
                as={Link}
                color={'cta'}
                href="https://app.optimism.io/bridge/deposit"
                target={'_blank'}
                rel={'noreferrer'}
              >
                Bridge ETH to Optimism
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex
        css={{
          display: awaitingWallet ? 'flex' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          p: '$md',
          justifyItems: 'space-around',
          justifyContent: 'space-around',
          alignItems: 'center',
          textAlign: 'center',
          background: '$surfaceNested',
          zIndex: 3,
          borderRadius: '$3',
        }}
      >
        <Text color="complete" semibold>
          {progress}
        </Text>
      </Flex>
    </Flex>
  );
};
