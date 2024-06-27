import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { artWidthMobile } from 'features/cosoul';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { webAppURL } from 'config/webAppURL';
import { Farcaster, Links, Wand } from 'icons/__generated';
import { CoSoulItemParty } from 'pages/CoSoulExplorePage/CoSoulItemParty';
import { GiveGraph } from 'pages/NetworkViz/GiveGraph';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Link, Text } from 'ui';

import { PartyProfileGives } from './PartyProfileGives';
import { PartyProfileHeader } from './PartyProfileHeader';
import { ProfileNetwork } from './ProfileNetwork';

const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const PartyProfileContent = ({
  address,
  css,
}: {
  address: string;
  css?: CSS;
}) => {
  const { data, isLoading: fetchCoLinksProfileIsLoading } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'profile'],
    () => fetchCoLinksProfile(address!)
  );
  const { data: cosoul } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'cosoul'],
    async () => {
      return fetchCoSoul(address!);
    }
  );

  const targetProfile = data as PublicProfile;
  const appURL = webAppURL('colinks');
  const castProfileUrl = `https://warpcast.com/~/compose?text=${appURL}/giveparty/${address}&embeds[]=${appURL}/giveparty/${address}`;

  const { data: details } = useQuery(
    ['fc_profile', targetProfile?.id],
    async () => {
      const { farcaster_accounts_by_pk: farcaster } = await anonClient.query(
        {
          farcaster_accounts_by_pk: [
            {
              profile_id: targetProfile.id,
            },
            {
              username: true,
            },
          ],
        },
        {
          operationName: 'partyProfileContent__farcaster_details',
        }
      );

      return {
        farcaster: farcaster ? farcaster.username : undefined,
      };
    }
  );

  if (!targetProfile) return;
  return (
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
        ...css,
      }}
    >
      {fetchCoLinksProfileIsLoading && '...loading'}

      <Flex column css={{ gap: '$md', alignItems: 'center' }}>
        <PartyProfileHeader profile={targetProfile} />
        <Flex css={{ gap: '$md', flexWrap: 'wrap', justifyContent: 'center' }}>
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
          {details?.farcaster && (
            <Button
              as={Link}
              target="_blank"
              rel="noreferrer"
              href={`https://warpcast.com/${details.farcaster}`}
            >
              <Farcaster fa />
              <Text medium css={{ ml: '$xs' }}>
                FC Profile
              </Text>
            </Button>
          )}
          <Button as={Link} href={castProfileUrl}>
            <Wand fa />
            <Text medium css={{ ml: '$xs' }}>
              Cast Profile
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
          <ProfileNetwork />
          <Flex
            css={{
              position: 'relative',
              height: 425,
              overflow: 'hidden',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '$2',
              mb: '$sm',
              width: '100%',
              maxWidth: 425,
              '@xs': {
                maxWidth: `${artWidthMobile}`,
              },
            }}
          >
            <GiveGraph
              address={address}
              height={425}
              width={425}
              zoom={false}
            />
          </Flex>
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
            {cosoul && <CoSoulItemParty cosoul={cosoul} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
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
      operationName: 'partyProfileContent__fetchCoLinksProfile',
    }
  );
  const profile = profiles_public.pop();

  return profile ? profile : null;
};

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;
