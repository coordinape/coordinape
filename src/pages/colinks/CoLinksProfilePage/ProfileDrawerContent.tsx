import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { artWidthMobile } from 'features/cosoul';
import { GiveReceived } from 'features/points/GiveReceived';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import { CSS } from 'stitches.config';

import { webAppURL } from 'config/webAppURL';
import { Farcaster, Links, Wand } from 'icons/__generated';
import { CoSoulItemParty } from 'pages/CoSoulExplorePage/CoSoulItemParty';
import { ProfileNetwork } from 'pages/GiveParty/ProfileNetwork';
import {
  QUERY_KEY_PARTY_PROFILE,
  useCoLinksProfile,
} from 'pages/GiveParty/useCoLinksProfile';
import { useFarcasterUser } from 'pages/GiveParty/useFarcasterUser';
import { coLinksPaths } from 'routes/paths';
import { Button, Flex, Link, Panel, Text } from 'ui';

import { ProfileHeader } from './ProfileHeader';

// import { PartyProfileHeader } from './PartyProfileHeader';

export const ProfileDrawerContent = ({
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
  const castProfileUrl = `https://warpcast.com/~/compose?text=${appURL}/${address}&embeds[]=${appURL}/${address}`;

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
        '.contentHeader': {
          m: 0,
          p: '0 0 $md',
        },
        ...css,
      }}
    >
      {fetchCoLinksProfileIsLoading && '...loading'}

      <Flex
        column
        css={{
          gap: '$md',
          alignItems: 'center',
          mt: '$md',
          '.profileHeader': {
            alignItems: 'center',
          },
        }}
      >
        <ProfileHeader targetAddress={targetProfile?.address || ''} drawer />
        <Flex css={{ gap: '$md', flexWrap: 'wrap', justifyContent: 'center' }}>
          {targetProfile && (
            <Button
              as={NavLink}
              to={coLinksPaths.profileGive(targetProfile.address ?? '')}
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
          {/*<CoLinksGiveButton*/}
          {/*  gives={[]}*/}
          {/*  targetProfileId={targetProfile?.id}*/}
          {/*  targetAddress={address}*/}
          {/*/>*/}
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
          <Text variant="label">GIVE Received</Text>
          <Panel
            noBorder
            css={{
              width: '100%',
              mt: '-$sm',
              p: '$sm',
              '.giveSkillContainer': {
                width: '100%',
                display: 'block',
                columnWidth: '120px',
                div: {
                  py: '$xs',
                },
              },
            }}
          >
            <GiveReceived address={address} size="large" />
          </Panel>
          <ProfileNetwork targetAddress={address} />
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
