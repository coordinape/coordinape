import { bullseyeMobileWidth, bullseyeWidth } from 'features/cosoul/constants';
import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { QUERY_KEY_NETWORK } from 'pages/colinks/CoLinksProfilePage/ProfileCards';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Box, Flex, Link, Text } from 'ui';

import { Bullseye } from './Bullseye';

export const ProfileNetwork = ({
  targetAddress,
  fullscreen = false,
}: {
  targetAddress?: string;
  fullscreen?: boolean;
}) => {
  const { address: paramAddress } = useParams<{ address: string }>();
  const address = targetAddress ?? paramAddress;
  const { data } = useQuery(
    [QUERY_KEY_NETWORK, address, 'profile'],
    async () => await fetchNetworkNodes(address!),
    { enabled: !!address }
  );

  const profile = data?.profile;

  const network:
    | {
        nodes: any[];
        tier_counts: { 1: number; 2: number; 3: number; 4: number; 5: number };
      }
    | undefined = data?.network;

  const nodes = network?.nodes ?? [];

  const usersTierOne = nodes.filter((n: any) => n.tier === 1);
  const usersTierTwo = nodes.filter((n: any) => n.tier === 2);
  const usersTierThree = nodes.filter((n: any) => n.tier === 3);
  const usersTierFour = nodes.filter((n: any) => n.tier === 4);
  const usersTierFive = nodes.filter((n: any) => n.tier === 5);

  return (
    <>
      <Box
        css={{
          position: 'relative',
          width: bullseyeWidth,
          aspectRatio: '1 / 1',
          my: 100,
          ...(fullscreen
            ? {
                fontSize: 17,
                '@media (orientation: landscape)': {
                  height: 'calc(100vh - 220px)',
                  minHeight: 600,
                },
              }
            : {
                fontSize: 14,
              }),
          '@xs': {
            fontSize: '12px',
            width: bullseyeMobileWidth,
          },
        }}
      >
        {profile && (
          <Link as={NavLink} to={coLinksPaths.profileGive(`${address}`)}>
            <Avatar
              name={profile.name}
              path={profile.avatar}
              css={{
                transform: `translate(-50%, -50%)`,
                left: '50%',
                top: '50%',
                position: 'absolute',
                zIndex: 6,
              }}
            />
          </Link>
        )}
        <Bullseye
          tier={5}
          totalCount={network?.tier_counts[5] ?? 0}
          users={usersTierFive}
          tierMessage={
            <Text semibold>
              Followers <br />
              in Farcaster
            </Text>
          }
        />
        <Bullseye
          tier={4}
          totalCount={network?.tier_counts[4] ?? 0}
          users={usersTierFour}
          tierMessage={
            <Text semibold>
              Following
              <br />
              in Farcaster
            </Text>
          }
        />
        <Bullseye
          tier={3}
          users={usersTierThree}
          totalCount={network?.tier_counts[3] ?? 0}
          tierMessage={
            <Flex column>
              <Text semibold>
                Mutually Linked <br />
                in Farcaster
              </Text>{' '}
            </Flex>
          }
        />

        <Bullseye
          tier={2}
          users={usersTierTwo}
          totalCount={network?.tier_counts[2] ?? 0}
          tierMessage={
            <Flex column>
              <Text semibold css={{ mb: '$xs' }}>
                GIVE Transferred
              </Text>{' '}
              <Text size="xs">& Mutuals</Text>
            </Flex>
          }
        />
        <Bullseye
          tier={1}
          users={usersTierOne}
          totalCount={network?.tier_counts[1] ?? 0}
          tierMessage={
            <Flex column>
              <Text semibold css={{ mb: '$xs' }}>
                Owns Colinks
              </Text>{' '}
              <Text size="xs">& GIVE tx</Text>
              <Text size="xs">& Mutuals</Text>
            </Flex>
          }
        />
      </Box>
    </>
  );
};

const fetchNetworkNodes = async (address: string) => {
  const res = await fetch(`/api/network/${address}`);
  const data = await res.json();
  return data;
};
