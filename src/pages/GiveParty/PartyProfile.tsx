/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { artWidth, artWidthMobile } from 'features/cosoul';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { Links, Wand } from 'icons/__generated';
import { CoSoulItemParty } from 'pages/CoSoulExplorePage/CoSoulItemParty';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Text } from 'ui';

import { PartyBody } from './PartyBody';
import { PartyHeader } from './PartyHeader';
import { PartyProfileGives } from './PartyProfileGives';
import { PartyProfileHeader } from './PartyProfileHeader';

const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const PartyProfile = () => {
  const { address } = useParams();
  const { data, isLoading: fetchCoLinksProfileIsLoading } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'profile'],
    () => fetchCoLinksProfile(address!)
  );
  const { data: cosoul, isLoading: fetchCoSoulIsLoading } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'cosoul'],
    async () => {
      return fetchCoSoul(address!);
    }
  );
  const targetProfile = data as PublicProfile;
  if (!targetProfile) return;
  return (
    <>
      <PartyBody>
        <PartyHeader />

        {/*Content*/}
        <Flex
          css={{
            padding: '16px',
            justifyContent: 'center',
            backgroundColor: 'rgb(8 18 29 / 25%)',
            borderRadius: '$2',
            margin: 'auto',
            width: `calc(${artWidthMobile} + 140px)`,
            '@xs': {
              width: `calc(${artWidthMobile} + 30px)`,
            },
          }}
        >
          {fetchCoLinksProfileIsLoading && '...loading'}

          <Flex column css={{ gap: '$md', alignItems: 'center' }}>
            <PartyProfileHeader profile={targetProfile} />
            <Flex
              css={{ gap: '$md', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              <Button
                as={NavLink}
                to={coLinksPaths.profile(targetProfile?.address ?? '')}
              >
                {' '}
                <Links fa />
                <Text medium css={{ ml: '$xs' }}>
                  Buy CoLink
                </Text>
              </Button>
              <Button>
                <Wand fa />
                <Text medium css={{ ml: '$xs' }}>
                  Cast Profile on Farcaster
                </Text>
              </Button>
            </Flex>
            <Flex
              column
              css={{
                width: '100%',
                mt: '$sm',
                gap: '$md',
                alignItems: 'center',
              }}
            >
              <PartyProfileGives profileId={targetProfile.id} />
              <Flex
                column
                css={{
                  gap: '$sm',
                  width: `${artWidthMobile}`,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text semibold css={{ fontSize: 30, color: '#ffffffa8' }}>
                  CoSoul
                </Text>
                {cosoul && <CoSoulItemParty cosoul={cosoul} />}
              </Flex>
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
