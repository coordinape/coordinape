import { useEffect } from 'react';

import { useQuery } from 'react-query';
import { NavLink, useParams } from 'react-router-dom';

import { Maximize } from 'icons/__generated';
import { coLinksPaths } from 'routes/paths';
import { Avatar, Box, Button, Link, Text } from 'ui';

import { Bullseye } from './Bullseye';

const QUERY_KEY_NETWORK = 'network';

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
  const nodes = data?.nodes ?? [];

  const filterNodesByScore = (minScore: number, maxScore: number) =>
    nodes.filter(
      (node: { score: number }) =>
        node.score > minScore && node.score <= maxScore
    );

  const usersTierOne = filterNodesByScore(1000, Infinity); // score > 1000
  const usersTierTwo = filterNodesByScore(500, 1000); // score > 500 and <= 1000
  const usersTierThree = filterNodesByScore(100, 500); // score > 100 and <= 500
  const usersTierFour = filterNodesByScore(10, 100); // score > 10 and <= 100
  const usersTierFive = filterNodesByScore(-Infinity, 10); // score <= 10

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('bullseye networkNodes:', nodes);
  }, [nodes]);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('bullseye profile:', profile);
  }, [profile]);

  return (
    <>
      <Box
        css={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          ...(fullscreen
            ? {
                fontSize: '3vmin',
                // marginTop: 150,
                '@media (orientation: landscape)': {
                  height: 'calc(100vh - 220px)',
                  minHeight: 600,
                },
              }
            : {
                fontSize: 14,
              }),
        }}
      >
        {profile && (
          <Link as={NavLink} to={coLinksPaths.partyProfile(`${address}`)}>
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
          tier={1}
          users={usersTierOne}
          tierMessage={<Text>Owns Colinks</Text>}
        />
        <Bullseye
          tier={2}
          users={usersTierTwo}
          tierMessage={<Text>GIVE Transferred</Text>}
        />
        <Bullseye
          tier={3}
          users={usersTierThree}
          tierMessage={<Text>Mutually Linked in FC</Text>}
        />
        <Bullseye
          tier={4}
          users={usersTierFour}
          tierMessage={<Text>Following</Text>}
        />
        <Bullseye
          tier={5}
          users={usersTierFive}
          tierMessage={<Text>Followers</Text>}
        />
      </Box>
      {!fullscreen && (
        <Box
          css={{
            mt: '$sm',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Button
            as={NavLink}
            to={coLinksPaths.profileNetwork(`${address}`)}
            color={'cta'}
            size="xs"
          >
            <Maximize />
            Expand View
          </Button>
        </Box>
      )}
    </>
  );
};

const fetchNetworkNodes = async (address: string) => {
  const res = await fetch(`/api/network/${address}`);
  const data = await res.json();
  return data;
};
