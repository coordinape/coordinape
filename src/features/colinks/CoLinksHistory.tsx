import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Avatar, Box, Flex, Link, Text } from '../../ui';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const CoLinksHistory = ({ subject }: { subject?: string }) => {
  const { data: txs } = useQuery(
    [QUERY_KEY_COLINKS, subject, 'history'],
    async () => {
      const { key_tx } = await client.query(
        {
          key_tx: [
            {
              where: subject
                ? {
                    subject: {
                      _ilike: subject,
                    },
                  }
                : {},
              order_by: [{ created_at: order_by.desc_nulls_last }],
              limit: 100,
            },
            {
              created_at: true,
              tx_hash: true,
              buy: true,
              eth_amount: true,
              share_amount: true,
              subject_profile: {
                name: true,
                avatar: true,
                address: true,
              },
              trader_profile: {
                name: true,
                avatar: true,
                address: true,
              },
            },
          ],
        },
        {
          operationName: 'coLinks_history',
        }
      );
      return key_tx;
    }
  );

  if (!txs) return null;

  return (
    <Flex column css={{ gap: '$sm', mx: '$sm' }}>
      {txs.map(tx => (
        <Flex
          key={tx.tx_hash}
          css={{ justifyContent: 'flex-start', gap: '$xs' }}
        >
          <Avatar
            path={tx.trader_profile?.avatar}
            name={tx.trader_profile?.name}
            size="small"
          />
          <Avatar
            path={tx.subject_profile?.avatar}
            name={tx.subject_profile?.name}
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
                to={paths.coLinksProfile(tx.trader_profile?.address ?? 'FIXME')}
              >
                <Text inline semibold size="small">
                  {tx.trader_profile?.name}
                </Text>
              </Link>

              <Text size="small" inline>
                {tx.buy ? 'bought ' : 'sold '}
              </Text>

              <Text inline size="small" css={{ mr: '$xs' }}>
                {tx.share_amount}
              </Text>

              <Link
                as={NavLink}
                css={{
                  display: 'inline',
                  alignItems: 'center',
                  gap: '$xs',
                  mr: '$xs',
                }}
                to={paths.coLinksProfile(
                  tx.subject_profile?.address ?? 'FIXME'
                )}
              >
                <Text inline size="small" semibold>
                  {tx.subject_profile?.name}
                </Text>
              </Link>

              <Text inline size="small" css={{ mr: '$xs' }}>
                key
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
      ))}
    </Flex>
  );
};
