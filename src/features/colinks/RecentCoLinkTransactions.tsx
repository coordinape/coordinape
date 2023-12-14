import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { LinkTx } from '../../pages/colinks/NotificationsPage';
import { coLinksPaths } from '../../routes/paths';
import { Avatar, Box, Flex, Link, Text } from '../../ui';

import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

export const RecentCoLinkTransactions = ({
  target,
  limit = 100,
}: {
  target?: string;
  limit?: number;
}) => {
  const { data: txs } = useQuery(
    [QUERY_KEY_COLINKS, target, 'history'],
    async () => {
      const { link_tx } = await client.query(
        {
          link_tx: [
            {
              where: target
                ? {
                    target: {
                      _ilike: target,
                    },
                  }
                : {},
              order_by: [{ created_at: order_by.desc_nulls_last }],
              limit,
            },
            {
              created_at: true,
              tx_hash: true,
              buy: true,
              holder: true,
              target: true,
              eth_amount: true,
              link_amount: true,
              target_profile: {
                name: true,
                avatar: true,
              },
              holder_profile: {
                name: true,
                avatar: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_history',
        }
      );
      return link_tx;
    }
  );

  if (!txs) return null;

  return (
    <Flex column css={{ gap: '$sm', mx: '$sm' }}>
      {txs.map(tx => (
        <Transaction key={tx.tx_hash} tx={tx} />
      ))}
    </Flex>
  );
};

export const Transaction = ({ tx }: { tx: LinkTx }) => {
  return (
    <Flex key={tx.tx_hash} css={{ justifyContent: 'flex-start', gap: '$xs' }}>
      <Avatar
        path={tx.holder_profile?.avatar}
        name={tx.holder_profile?.name || '?'}
        size="small"
      />
      <Avatar
        path={tx.target_profile?.avatar}
        name={tx.target_profile?.name || '?'}
        size="small"
        css={{ ml: '-$md' }}
      />
      <Flex column css={{ pl: '$xs', gap: '$xs' }}>
        <Box css={{ gap: '$xs' }}>
          <Link
            as={NavLink}
            css={{
              display: 'inline',
              alignItems: 'center',
              gap: '$xs',
              mr: '$xs',
            }}
            to={coLinksPaths.profile(tx.holder ?? '')}
          >
            <Text inline semibold size="small">
              {tx.holder_profile?.name || '?'}
            </Text>
          </Link>

          <Text size="small" inline>
            {tx.buy ? 'bought ' : 'sold '}
          </Text>

          <Text inline size="small" css={{ mr: '$xs' }}>
            {tx.link_amount}
          </Text>

          {tx.target === tx.holder ? (
            <Text inline size="small">
              of their own{' '}
            </Text>
          ) : (
            <Link
              as={NavLink}
              css={{
                display: 'inline',
                alignItems: 'center',
                gap: '$xs',
                mr: '$xs',
              }}
              to={coLinksPaths.profile(tx.target ?? 'FIXME')}
            >
              <Text inline size="small" semibold>
                {tx.target_profile?.name || '?'}
              </Text>
            </Link>
          )}

          <Text inline size="small" css={{ mr: '$xs' }}>
            link{tx.link_amount === '1' ? '' : 's'}
          </Text>
        </Box>
        <Flex css={{ justifyContent: 'flex-start' }}>
          <Text size="xs" semibold color={tx.buy ? 'complete' : 'warning'}>
            {ethers.utils.formatEther(tx.eth_amount)} ETH
          </Text>
          <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
            {DateTime.fromISO(tx.created_at).toLocal().toRelative()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
