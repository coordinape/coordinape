import { ReactNode } from 'react';

import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { CoLinksNameAndAvatar } from './CoLinksNameAndAvatar';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

const fetchLinkHolders = async (target?: string, limit?: number) => {
  const { link_holders } = await client.query(
    {
      link_holders: [
        {
          where: {
            target: {
              _eq: target,
            },
            amount: {
              _gt: 0,
            },
          },
          order_by: [
            { amount: order_by.desc_nulls_last },
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
  children: (
    list: ReactNode,
    counts?: { link_holders: number; total_links: number }
  ) => ReactNode;
  limit?: number;
}) => {
  const { data: counts } = useQuery(
    [QUERY_KEY_COLINKS, target, 'holdersCount'],
    async () => {
      const { link_holders, total_links } = await client.query(
        {
          __alias: {
            link_holders: {
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
                    count: [{}, true],
                  },
                },
              ],
            },
            total_links: {
              link_holders_aggregate: [
                {
                  where: {
                    target: {
                      _eq: target,
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
          },
        },
        {
          operationName: 'coLinks_holders_count',
        }
      );
      return {
        link_holders: link_holders.aggregate?.count ?? 0,
        total_links: total_links.aggregate?.sum?.amount ?? 0,
      };
    },
    {
      enabled: !!target,
    }
  );

  const { data: holders } = useQuery(
    [QUERY_KEY_COLINKS, target, 'holders'],
    async () => fetchLinkHolders(target, limit),
    {
      enabled: !!target,
    }
  );

  return <>{children(<LinkHoldersList holders={holders} />, counts)}</>;
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
