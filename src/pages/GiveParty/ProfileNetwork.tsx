import { useEffect } from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Box } from 'ui';

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
  const { data: networkNodes } = useQuery(
    [QUERY_KEY_NETWORK, address, 'profile'],
    async () => await fetchNetworkNodes(address!),
    { enabled: !!address }
  );

  const usersTierOne = (networkNodes?.nodes ?? []).slice(0, 10);
  const usersTierTwo = (networkNodes?.nodes ?? []).slice(11, 20);
  const usersTierThree = (networkNodes?.nodes ?? []).slice(21, 30);
  const usersTierFour = (networkNodes?.nodes ?? []).slice(31, 40);
  const usersTierFive = (networkNodes?.nodes ?? []).slice(41, 60);
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('bullseye networkNodes:', networkNodes);
  }, [networkNodes]);

  return (
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
      {/* {profile && (
        <Avatar
          name={profile.name}
          path={profile.avatar}
          css={{
            position: 'absolute',
            transform: `translate(calc(50vw - 3vmin), calc(50vh - 3vmin))`,
            zIndex: 6,
            width: '6vmin !important',
            height: '6vmin',
          }}
        />
      )} */}

      <Bullseye tier={1} users={usersTierOne} />
      <Bullseye tier={2} users={usersTierTwo} />
      <Bullseye tier={3} users={usersTierThree} />
      <Bullseye tier={4} users={usersTierFour} />
      <Bullseye tier={5} users={usersTierFive} />
    </Box>
  );
};

const fetchNetworkNodes = async (address: string) => {
  const res = await fetch(`/api/network/${address}`);
  const data = await res.json();
  return data;
};
