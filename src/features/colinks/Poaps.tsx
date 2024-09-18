import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';

import { Circle2, Wreath } from '../../icons/__generated';
import { order_by } from '../../lib/anongql/__generated__/zeus';
import { Flex, Image, Link, Text } from '../../ui';

import { RightColumnSection } from './RightColumnSection';

const MAX_POAPS_TO_SHOW = 10;
const USE_DEMO_DATA = false;

const DEMO_DATA = {
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

const fetchPoaps = async (address: string) => {
  const { poap_holders, poap_holders_aggregate } = await anonClient.query(
    {
      poap_holders_aggregate: [
        {
          where: {
            address: {
              _ilike: address,
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
              _ilike: address,
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
      operationName: 'getPoapHolders',
    }
  );
  return {
    poaps: poap_holders,
    count: poap_holders_aggregate.aggregate?.count ?? 0,
  };
};

// type Poap = Awaited<ReturnType<typeof fetchPoaps>>['poaps'][number];

export const Poaps = ({
  address,
  profileCard = false,
}: {
  address: string;
  profileCard?: boolean;
}) => {
  const { data } = useQuery(['poaps', address], async () => {
    if (USE_DEMO_DATA) {
      return DEMO_DATA;
    }
    return fetchPoaps(address);
  });

  return (
    <RightColumnSection
      css={{
        minWidth: 240,
        flexGrow: profileCard ? 1 : 0,
        overflow: 'clip',
        '>div': {
          gap: 0,
        },
      }}
      title={
        <Text
          as={Link}
          href={`https://collectors.poap.xyz/scan/${address}`}
          color={'default'}
          semibold
          target={'_blank'}
          rel="noreferrer"
          css={{ width: '100%' }}
        >
          {profileCard ? (
            <Flex
              css={{
                p: '$md',
                m: '-$md',
                alignItems: 'center',
                width: '100%',
                flexGrow: 1,
                color: '$text',
                height: 90,
                '@sm': {
                  color: 'white',
                  background:
                    'radial-gradient(circle at -10% 10%, $profileCardPoapsGradientStart 20%, $profileCardPoapsGradientEnd 100%)',
                },
              }}
            >
              <Wreath fa size="2xl" />
              <Flex column>
                <Flex
                  css={{
                    gap: '$xs',
                    color: '$text',
                    ml: '$sm',
                    '@sm': {
                      color: 'white',
                    },
                  }}
                >
                  <Text semibold>{data?.count}</Text>
                  <Text>POAPs</Text>
                </Flex>
              </Flex>
            </Flex>
          ) : (
            <>
              <Circle2 nostroke />
              {data?.count} POAPs
            </>
          )}
        </Text>
      }
    >
      {data && data.count > 0 && (
        <Flex
          column
          css={{ gap: '$md', width: '100%', mt: profileCard ? '$xl' : '$md' }}
        >
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
      )}
    </RightColumnSection>
  );
};
