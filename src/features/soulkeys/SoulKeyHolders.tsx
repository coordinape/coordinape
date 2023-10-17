import { useQuery } from 'react-query';

import { Users } from '../../icons/__generated';
import {
  key_holders_select_column,
  order_by,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { SoulKeyNameAndAvatar } from './SoulKeyNameAndAvatar';

export const SoulKeyHolders = ({ subject }: { subject: string }) => {
  const { data: holdersCount } = useQuery(
    ['soulKeys', subject, 'holdersCount'],
    async () => {
      const { key_holders_aggregate } = await client.query(
        {
          key_holders_aggregate: [
            {
              where: {
                subject: {
                  _eq: subject,
                },
                amount: {
                  _gt: 0,
                },
              },
            },
            {
              aggregate: {
                sum: {
                  amount: true,
                },
              },
            },
          ],
        },
        {
          operationName: 'soulKeys_holders_count',
        }
      );
      return key_holders_aggregate.aggregate?.sum?.amount ?? 0;
    }
  );

  const { data: holders } = useQuery(
    ['soulKeys', subject, 'holders'],
    async () => {
      const { key_holders } = await client.query(
        {
          key_holders: [
            {
              where: {
                subject: {
                  _eq: subject,
                },
                amount: {
                  _gt: 0,
                },
              },
              distinct_on: [key_holders_select_column.address],
              order_by: [
                { address: order_by.desc_nulls_last },
                { updated_at: order_by.desc_nulls_last },
              ],
            },
            {
              amount: true,
              address_cosoul: {
                profile_public: {
                  name: true,
                  avatar: true,
                },
              },
              address: true,
            },
          ],
        },
        {
          operationName: 'soulKeys_holders',
        }
      );
      return key_holders;
    }
  );

  return (
    <Flex column css={{ gap: '$md' }}>
      <Text
        tag
        color="complete"
        size="medium"
        css={{ justifyContent: 'flex-start', py: '$md', px: '$md' }}
      >
        <Users css={{ mr: '$xs' }} /> {holdersCount} Key Holders
      </Text>
      {holders ? (
        <Flex column css={{ gap: '$md', px: '$sm' }}>
          {holders.map(holder => (
            <Flex key={holder.address}>
              <SoulKeyNameAndAvatar
                avatar={holder.address_cosoul?.profile_public?.avatar}
                name={holder.address_cosoul?.profile_public?.name}
                address={holder.address}
              />
              {holder.amount && <Text color="cta"> x{holder.amount}</Text>}
            </Flex>
          ))}
        </Flex>
      ) : (
        <Text>No Key Holders</Text>
      )}
    </Flex>
  );
};
