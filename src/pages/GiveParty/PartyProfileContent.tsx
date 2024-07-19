import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { artWidthMobile } from 'features/cosoul';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { webAppURL } from 'config/webAppURL';
import { Farcaster, Links, Wand } from 'icons/__generated';
import { CoSoulItemParty } from 'pages/CoSoulExplorePage/CoSoulItemParty';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Link, Text } from 'ui';

import { PartyProfileGives } from './PartyProfileGives';
import { PartyProfileHeader } from './PartyProfileHeader';
import { ProfileNetwork } from './ProfileNetwork';
import {
  QUERY_KEY_PARTY_PROFILE,
  useCoLinksProfile,
} from './useCoLinksProfile';
import { useFarcasterUser } from './useFarcasterUser';

export const PartyProfileContent = ({
  address,
  css,
}: {
  address: string;
  css?: CSS;
}) => {
  const { data: targetProfile, isLoading: fetchCoLinksProfileIsLoading } =
    useCoLinksProfile(address);
  const { data: fcUser } = useFarcasterUser(address!);

  const { data: cosoul } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'cosoul'],
    async () => {
      return fetchCoSoul(address!);
    }
  );

  const appURL = webAppURL('colinks');
  const castProfileUrl = `https://warpcast.com/~/compose?text=${appURL}/giveparty/${address}&embeds[]=${appURL}/giveparty/${address}`;

  const { data: details } = useQuery(
    ['fc_profile', targetProfile?.id],
    async () => {
      const { farcaster_accounts_by_pk: farcaster } = await anonClient.query(
        {
          farcaster_accounts_by_pk: [
            {
              profile_id: targetProfile!.id,
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
    },
    {
      enabled: !!targetProfile,
    }
  );

  // TODO: handle this better
  if (!targetProfile && !fcUser) return;
  return (
    <Flex
      css={{
        padding: '16px',
        justifyContent: 'center',
        backgroundColor: 'rgb(8 18 29 / 25%)',
        borderRadius: '$2',
        margin: 'auto',
        ...css,
      }}
    >
      {fetchCoLinksProfileIsLoading && '...loading'}

      <Flex column css={{ gap: '$md', alignItems: 'center' }}>
        <PartyProfileHeader profile={targetProfile} fcUser={fcUser} />
        <Flex css={{ gap: '$md', flexWrap: 'wrap', justifyContent: 'center' }}>
          {targetProfile && (
            <Button
              as={NavLink}
              to={coLinksPaths.profile(targetProfile.address ?? '')}
            >
              {' '}
              <Links fa />
              <Text medium css={{ ml: '$xs' }}>
                Buy CoLink
              </Text>
            </Button>
          )}
          {(details?.farcaster || fcUser) && (
            <Button
              as={Link}
              target="_blank"
              rel="noreferrer"
              href={`https://warpcast.com/${details?.farcaster || fcUser?.username}`}
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
          <ProfileNetwork targetAddress={address} />
          {targetProfile ? (
            <PartyProfileGives profileId={targetProfile.id} />
          ) : (
            // TODO: handle this better
            <Text>no gives yet </Text>
          )}
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
