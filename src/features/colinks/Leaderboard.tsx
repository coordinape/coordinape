import { useQuery } from 'react-query';

import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { paths } from '../../routes/paths';
import { AppLink, Avatar, Flex, Text } from '../../ui';

import { QUERY_KEY_COLINKS } from './CoLinksWizard';

export const Leaderboard = ({
  limit = 100,
  board,
}: {
  limit?: number;
  board: 'holders' | 'targets';
}) => {
  const { data: leaders } = useQuery(
    [QUERY_KEY_COLINKS, 'leaderboard'],
    async () => {
      const { holding_most, most_holders } = await client.query(
        {
          __alias: {
            holding_most: {
              cosouls: [
                {
                  limit,
                  order_by: [
                    {
                      held_links_aggregate: {
                        sum: {
                          amount: order_by.desc_nulls_last,
                        },
                      },
                    },
                  ],
                },
                {
                  profile_public: {
                    name: true,
                    avatar: true,
                    address: true,
                  },
                  held_links_aggregate: [
                    {},
                    {
                      aggregate: {
                        sum: { amount: true },
                      },
                    },
                  ],
                },
              ],
            },
            most_holders: {
              cosouls: [
                {
                  limit,
                  order_by: [
                    {
                      link_holders_aggregate: {
                        sum: {
                          amount: order_by.desc_nulls_last,
                        },
                      },
                    },
                  ],
                },
                {
                  profile_public: {
                    name: true,
                    avatar: true,
                    address: true,
                  },
                  link_holders_aggregate: [
                    {},
                    {
                      aggregate: {
                        sum: { amount: true },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          operationName: 'coLinks_leaderboard',
        }
      );
      return {
        holders: holding_most.map(h => ({
          count: h.held_links_aggregate?.aggregate?.sum?.amount ?? 0,
          ...h.profile_public,
        })),
        targets: most_holders.map(h => ({
          count: h.link_holders_aggregate?.aggregate?.sum?.amount ?? 0,
          ...h.profile_public,
        })),
      };
    }
  );

  if (!leaders) return null;

  return (
    <Flex column css={{ gap: '$md', mx: '$sm', width: '100%' }}>
      {(board === 'targets' ? leaders.targets : leaders.holders).map(
        (leader, idx) => (
          <Flex
            as={AppLink}
            to={paths.coLinksProfile(leader.address ?? 'FIXME')}
            key={leader.address}
            css={{
              justifyContent: 'space-between',
              gap: '$md',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Flex css={{ alignItems: 'center', gap: '$md' }}>
              <Flex>
                {' '}
                <Text size={'medium'} css={{ color: '$text' }} semibold>
                  #{idx + 1}
                </Text>
              </Flex>
              <Avatar path={leader.avatar} name={leader.name} size="small" />
              <Text inline semibold size="small">
                {leader.name}
              </Text>
            </Flex>
            <Text
              tag
              color={'secondary'}
              inline
              size="small"
              css={{ mr: '$xs' }}
            >
              {leader.count} links
            </Text>
          </Flex>
        )
      )}
    </Flex>
  );
};
