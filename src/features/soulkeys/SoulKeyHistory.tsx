import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { Avatar, Flex, Link, Text } from '../../ui';

export const SoulKeyHistory = ({ subject }: { subject?: string }) => {
  const { data: txs } = useQuery(['soulKeyHistory', subject], async () => {
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
    <Flex column css={{ gap: '$sm', mx: '$md' }}>
      {txs.map(tx => (
        <Flex key={tx.tx_hash} css={{ gap: '$xs', alignItems: 'center' }}>
          <Link
            as={NavLink}
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '$xs',
              mr: '$xs',
            }}
            to={paths.cosoulView(tx.trader_profile?.address ?? 'FIXME')}
          >
            <Avatar
              path={tx.trader_profile?.avatar}
              name={tx.trader_profile?.name}
              size="xs"
            />
            <Text>{tx.trader_profile?.name}</Text>
          </Link>
          {tx.buy ? <Text>bought</Text> : <Text>sold</Text>}
          <Text>{tx.share_amount} key of </Text>
          <Link
            as={NavLink}
            css={{
              display: 'flex',
              alignItems: 'center',
              gap: '$xs',
              mx: '$xs',
            }}
            to={paths.cosoulView(tx.subject_profile?.address ?? 'FIXME')}
          >
            <Avatar
              path={tx.subject_profile?.avatar}
              name={tx.subject_profile?.name}
              size="xs"
            />
            <Text>{tx.subject_profile?.name}</Text>
          </Link>
          {/*<Text>{tx.subject_profile?.address}</Text>*/}
          <Text> for </Text>
          <Text>{ethers.utils.formatEther(tx.eth_amount)} ETH</Text>
          <Text size="xs" color="neutral" css={{ pl: '$sm' }}>
            {DateTime.fromISO(tx.created_at).toLocal().toRelative()}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};
