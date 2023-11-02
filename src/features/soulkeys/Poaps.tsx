import { useQuery } from 'react-query';

import { Clock } from '../../icons/__generated';
import { order_by } from '../../lib/gql/__generated__/zeus';
import { client } from '../../lib/gql/client';
import { Flex, Image, Link, Text } from '../../ui';

import { RightColumnSection } from './RightColumnSection';

const MAX_POAPS_TO_SHOW = 10;
export const Poaps = ({ address }: { address: string }) => {
  const { data } = useQuery(['poaps', address], async () => {
    return {
      poaps: [
        {
          id: 123,
          event: {
            image_url:
              'https://assets.poap.xyz/metaverse-amazing-new-age-genesis-2022-logo-1642695189227.png',
            name: 'Metaverse Amazing New Age Genesis 2022',
            event_url: 'https://mana.xyz',
          },
        },
        {
          id: 124,
          event: {
            image_url:
              'https://assets.poap.xyz/syklolive-con-natyshi-02092021-2021-logo-1630612787443.png',
            name: 'SykloLIVE con NatyShi 02/09/2021',
            event_url: 'https://www.youtube.com/watch?v=QlWN6E1ySS4',
          },
        },
        {
          id: 125,
          event: {
            image_url:
              'https://assets.poap.xyz/tensaistudio-puzzle-lab-monthly-puzzle-level-15-2021-logo-1628165462157.gif',
            name: 'TensaiStudio Puzzle Lab Monthly Puzzle: Level 15',
            event_url:
              'https://play.decentraland.org/?position=61%2C31&realm=fenrir-amber',
          },
        },
      ],
      count: 100,
    };

    const { poap_holders, poap_holders_aggregate } = await client.query(
      {
        poap_holders_aggregate: [
          {
            where: {
              address: {
                _eq: address,
              },
            },
          },
          {
            aggregate: {
              count: [{}, true],
            },
          },
        ],
        poap_holders: [
          {
            where: {
              address: {
                _eq: address,
              },
            },
            order_by: [{ event_id: order_by.desc }],
            limit: MAX_POAPS_TO_SHOW,
          },
          {
            id: true,
            event: {
              image_url: true,
              name: true,
              event_url: true,
            },
          },
        ],
      },
      {
        operationName: 'poap_holders',
      }
    );
    return {
      poaps: poap_holders,
      count: poap_holders_aggregate.aggregate?.count ?? 0,
    };
  });

  return (
    <RightColumnSection
      title={
        <Flex>
          <Clock />
          {data?.count} POAPs
        </Flex>
      }
    >
      <Flex column css={{ gap: '$md', width: '100%' }}>
        {data?.poaps.map(
          poap =>
            poap?.event && (
              <Link
                key={poap.id}
                href={poap.event.event_url}
                target="_blank"
                rel="noreferrer"
              >
                <Flex css={{ gap: '$sm', alignItems: 'center' }}>
                  <Image
                    src={poap.event.image_url}
                    width={24}
                    height={24}
                    css={{ borderRadius: 9999 }}
                  />
                  <Text size="small">{poap.event.name}</Text>
                </Flex>
              </Link>
            )
        )}
        {data?.count !== undefined && data.count > MAX_POAPS_TO_SHOW && (
          <Flex css={{ justifyContent: 'flex-end' }}>
            <Link
              href={`https://collectors.poap.xyz/scan/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              <Text size="xs">View all {data?.count} POAPs</Text>
            </Link>
          </Flex>
        )}
      </Flex>
    </RightColumnSection>
  );
};
