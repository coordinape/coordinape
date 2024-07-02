/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';

import { useWindowSize } from '@react-hook/window-size';
import { artWidthMobile } from 'features/cosoul';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { Flex } from 'ui';

import { PartyBody } from './PartyBody';
import { PartyHeader } from './PartyHeader';
import { PartyProfileContent } from './PartyProfileContent';

const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const PartyProfile = () => {
  const { address } = useParams();
  const { data } = useQuery([QUERY_KEY_PARTY_PROFILE, address, 'profile'], () =>
    fetchCoLinksProfile(address!)
  );
  const [width] = useWindowSize();

  useEffect(() => {
    console.log('width:', width);
  }, []);

  const profileColumnWidth = 520;
  const mapWidth = width - profileColumnWidth;
  const desktop = width > 1140;

  const targetProfile = data as PublicProfile;
  if (!targetProfile) return;
  return (
    <>
      <PartyBody css={{ width: '100%', margin: desktop ? 0 : 'auto' }}>
        <PartyHeader />
        <Flex column css={{ gap: '$md' }}>
          <PartyProfileContent
            address={address!}
            css={{
              zIndex: 1,
              position: desktop ? 'absolute' : 'relative',
              right: desktop ? '$md' : 0,
              width: 600,
              '@lg': {
                width: profileColumnWidth,
              },
            }}
          />

          <Flex css={{ flexGrow: 1 }}>
            <Flex
              css={{
                overflow: 'hidden',
                ...(desktop
                  ? { width: mapWidth, position: 'absolute', left: '$md' }
                  : {
                      width: profileColumnWidth,
                      position: 'relative',
                      // left: `calc(50% - (${profileColumnWidth}/2))`,
                      margin: 'auto',
                    }),
                // border: '3px solid rgba(0,0,0,0.2)',
                // borderRadius: '$3',
                // height: 800,
                // maxWidth: 1000,
                // '@xs': {
                //   maxWidth: `${artWidthMobile}`,
                // },
              }}
            >
              <GiveGraph
                address={address}
                height={desktop ? undefined : profileColumnWidth}
                width={desktop ? mapWidth : profileColumnWidth}
                minZoom={2}
                expand={desktop}
              />
            </Flex>
          </Flex>
        </Flex>
      </PartyBody>
    </>
  );
};

const fetchCoLinksProfile = async (address: string) => {
  const { profiles_public } = await anonClient.query(
    {
      profiles_public: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          id: true,
          name: true,
          avatar: true,
          address: true,
          website: true,
          links: true,
          description: true,
          reputation_score: {
            total_score: true,
          },
        },
      ],
    },
    {
      operationName: 'coLinks_profile',
    }
  );
  const profile = profiles_public.pop();

  return profile ? profile : null;
};

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;
