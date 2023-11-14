import { ReactNode } from 'react';

import { useQuery } from 'react-query';

import {
  link_holders_select_column,
  order_by,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { CoLinksNameAndAvatar } from './CoLinksNameAndAvatar';
import { QUERY_KEY_COLINKS } from './CoLinksWizard';

const fetchLinkHolders = async (target?: string, limit?: number) => {
  const { link_holders } = await client.query(
    {
      link_holders: [
        {
          where: {
            holder: {
              _eq: target,
            },
            amount: {
              _gt: 0,
            },
          },
          distinct_on: [link_holders_select_column.holder],
          order_by: [
            { holder: order_by.desc_nulls_last },
            { updated_at: order_by.desc_nulls_last },
          ],
          limit,
        },
        {
          amount: true,
          holder_cosoul: {
            profile_public: {
              name: true,
              avatar: true,
            },
          },
          holder: true,
        },
      ],
    },
    {
      operationName: 'coLinks_holders',
    }
  );
  return link_holders;
};

type LinkHolder = Awaited<ReturnType<typeof fetchLinkHolders>>[number];

export const LinkHolders = ({
  target,
  children,
  limit,
}: {
  target: string;
  children: (list: ReactNode, holdersCount?: number) => ReactNode;
  limit?: number;
}) => {
  const { data: holdersCount } = useQuery(
    [QUERY_KEY_COLINKS, target, 'holdersCount'],
    async () => {
      const { link_holders_aggregate } = await client.query(
        {
          link_holders_aggregate: [
            {
              where: {
                target: {
                  _eq: target,
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
          operationName: 'coLinks_holders_count',
        }
      );
      return link_holders_aggregate.aggregate?.sum?.amount ?? 0;
    }
  );

  const { data: holders } = useQuery(
    [QUERY_KEY_COLINKS, target, 'holders'],
    async () => fetchLinkHolders(target, limit),
    {
      enabled: !!target,
    }
  );

  return <>{children(<LinkHoldersList holders={holders} />, holdersCount)}</>;
};

const LinkHoldersList = ({ holders }: { holders?: LinkHolder[] }) => {
  return (
    <>
      {holders ? (
        <Flex column css={{ gap: '$md', px: '$sm' }}>
          {holders.map(holder => (
            <Flex key={holder.holder}>
              <CoLinksNameAndAvatar
                avatar={holder.holder_cosoul?.profile_public?.avatar}
                name={holder.holder_cosoul?.profile_public?.name}
                address={holder.holder}
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
        <Text>No Link Holders</Text>
      )}
    </>
  );
};
