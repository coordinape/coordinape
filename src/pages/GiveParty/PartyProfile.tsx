/* eslint-disable @typescript-eslint/no-unused-vars */

import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { artWidthMobile } from 'features/cosoul';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { CoSoulItem } from 'pages/CoSoulExplorePage/CoSoulItem';
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
            maxWidth: 800,
          }}
        >
          {fetchCoLinksProfileIsLoading && '...loading'}

          <Flex column css={{ gap: '$md', alignItems: 'center' }}>
            <PartyProfileHeader profile={targetProfile} />
            <Flex css={{ gap: '$md' }}>
              <Button>Buy Link</Button>
              <Button>Cast Profile on Farcaster</Button>
            </Flex>
            <Flex
              css={{
                width: '100%',
                gap: '$md',
                '@xs': {
                  flexDirection: 'column-reverse',
                  alignItems: 'center',
                },
              }}
            >
              <PartyProfileGives profileId={targetProfile.id} />
              <Flex
                column
                css={{
                  gap: '$lg',
                  width: `${artWidthMobile}`,
                }}
              >
                {cosoul && (
                  <CoSoulItem cosoul={cosoul} exploreView={false} artOnly />
                )}
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
