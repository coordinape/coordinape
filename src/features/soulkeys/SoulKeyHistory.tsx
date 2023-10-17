import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { SoulKeyNameAndAvatar } from './SoulKeyNameAndAvatar';

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
    <Flex column css={{ gap: '$sm', mx: '$md' }}>
      {txs.map(tx => (
        <Flex key={tx.tx_hash} css={{ gap: '$xs', alignItems: 'center' }}>
          <SoulKeyNameAndAvatar
            avatar={tx.trader_profile?.avatar}
            name={tx.trader_profile?.name}
            address={tx.trader_profile?.address}
          />
          {tx.buy ? <Text>bought</Text> : <Text>sold</Text>}
          <Text>{tx.share_amount} key of </Text>
          <SoulKeyNameAndAvatar
            avatar={tx.subject_profile?.avatar}
            name={tx.subject_profile?.name}
            address={tx.subject_profile?.address}
          />
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
