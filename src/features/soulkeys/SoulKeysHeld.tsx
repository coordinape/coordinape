import { useQuery } from 'react-query';

import { Briefcase } from '../../icons/__generated';
import {
  key_holders_select_column,
  order_by,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { RightColumnSection } from './RightColumnSection';
import { SoulKeyNameAndAvatar } from './SoulKeyNameAndAvatar';

export const SoulKeysHeld = ({ address }: { address: string }) => {
  const { data: heldCount } = useQuery(
    ['soulKeys', address, 'heldCount'],
    async () => {
      const { key_holders_aggregate } = await client.query(
        {
          key_holders_aggregate: [
            {
              where: {
                address: {
                  _eq: address,
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
          operationName: 'soulKeys_held_count',
        }
      );
      return key_holders_aggregate.aggregate?.sum?.amount ?? 0;
    }
  );

  const { data: held } = useQuery(['soulKeys', address, 'held'], async () => {
    const { key_holders } = await client.query(
      {
        key_holders: [
          {
            where: {
              address: {
                _eq: address,
              },
              amount: {
                _gt: 0,
              },
            },
            distinct_on: [key_holders_select_column.subject],
            order_by: [
              { subject: order_by.desc_nulls_last },
              { updated_at: order_by.desc_nulls_last },
            ],
          },
          {
            amount: true,
            subject_cosoul: {
              profile_public: {
                name: true,
                avatar: true,
              },
            },
            subject: true,
          },
        ],
      },
      {
        operationName: 'soulKeys_held',
      }
    );
    return key_holders;
  });

  return (
    <RightColumnSection
      title={
        <Flex>
          <Briefcase css={{ mr: '$sm' }} /> Holding {heldCount} Key
          {heldCount == 1 ? '' : 's'}
        </Flex>
      }
    >
      {held ? (
        <Flex column css={{ gap: '$md', px: '$sm' }}>
          {held.map(holder => (
            <Flex key={holder.subject}>
              <SoulKeyNameAndAvatar
                avatar={holder.subject_cosoul?.profile_public?.avatar}
                name={holder.subject_cosoul?.profile_public?.name}
                address={holder.subject}
              />
              {holder.amount && (
                <Text color="neutral" size="small" semibold>
                  {' '}
                  x{holder.amount}
                </Text>
              )}
            </Flex>
          ))}
        </Flex>
      ) : (
        <Text>No Keys Held</Text>
      )}
    </RightColumnSection>
  );
};
