import { useQuery } from 'react-query';

import {
  link_holders_select_column,
  order_by,
} from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Text } from '../../ui';

import { CoLinksNameAndAvatar } from './CoLinksNameAndAvatar';
import { QUERY_KEY_COLINKS } from './wizard/CoLinksWizard';

const getLinkHolders = async (holder: string) => {
  const { link_holders } = await client.query(
    {
      link_holders: [
        {
          where: {
            holder: {
              _eq: holder,
            },
            amount: {
              _gt: 0,
            },
          },
          distinct_on: [link_holders_select_column.target],
          order_by: [
            { target: order_by.desc_nulls_last },
            { updated_at: order_by.desc_nulls_last },
          ],
        },
        {
          amount: true,
          target_cosoul: {
            profile_public: {
              name: true,
              avatar: true,
            },
          },
          target: true,
        },
      ],
    },
    {
      operationName: 'coLinks_held',
    }
  );
  return link_holders;
};

type LinkHolder = Awaited<ReturnType<typeof getLinkHolders>>[number];

function CoLinksHeldList({ holders }: { holders?: LinkHolder[] }) {
  return (
    <>
      {holders ? (
        <Flex column css={{ gap: '$md', px: '$sm' }}>
          {holders.map(holder => (
            <Flex key={holder.target}>
              <CoLinksNameAndAvatar
                avatar={holder.target_cosoul?.profile_public?.avatar}
                name={holder.target_cosoul?.profile_public?.name}
                address={holder.target}
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
        <Text>No Links Held</Text>
      )}
    </>
  );
}

export const LinkHoldings = ({
  holder,
  children,
}: {
  holder: string;
  children: (list: React.ReactNode, heldCount?: number) => React.ReactNode;
}) => {
  const { data: heldCount } = useQuery(
    [QUERY_KEY_COLINKS, holder, 'heldCount'],
    async () => {
      const { link_holders_aggregate } = await client.query(
        {
          link_holders_aggregate: [
            {
              where: {
                holder: {
                  _eq: holder,
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
          operationName: 'coLinks_held_count',
        }
      );
      return link_holders_aggregate.aggregate?.sum?.amount ?? 0;
    }
  );

  const { data: held } = useQuery(
    [QUERY_KEY_COLINKS, holder, 'held'],
    async () => getLinkHolders(holder)
  );

  return <>{children(<CoLinksHeldList holders={held} />, heldCount)}</>;
};
