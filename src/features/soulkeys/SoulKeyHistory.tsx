import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Avatar, Flex, Link, Text } from '../../ui';

export const SoulKeyHistory = ({ subject }: { subject?: string }) => {
  const { data: txs } = useQuery(['soulKeys', subject, 'history'], async () => {
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
        operationName: 'soulKeys_history',
      }
    );
    return key_tx;
  });

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
            <Flex css={{ gap: '$xs' }}>
              <Link
                as={NavLink}
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '$xs',
                  mr: '$xs',
                }}
                to={paths.soulKey(tx.trader_profile?.address ?? 'FIXME')}
              >
                <Text inline semibold>
                  {tx.trader_profile?.name}
                </Text>
              </Link>
              {tx.buy ? <Text inline>bought</Text> : <Text>sold</Text>}

              <Text inline css={{ mr: '$xs' }}>
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
                to={paths.soulKey(tx.subject_profile?.address ?? 'FIXME')}
              >
                <Text inline semibold>
                  {tx.subject_profile?.name}
                </Text>
              </Link>

              <Text css={{ mr: '$xs' }}>key</Text>
            </Flex>
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
