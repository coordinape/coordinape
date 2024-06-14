/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from 'react';

import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { anonClient } from 'lib/anongql/anonClient';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Avatar, Box } from 'ui';

import { NodesOnCircle, User } from './NodesOnCircle';

const QUERY_KEY_NETWORK = 'network';

export const ProfileNetwork: React.FC = () => {
  const { address } = useParams();
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
    console.log(networkNodes);
  }, [networkNodes]);

  return (
    <Box css={{ position: 'relative', width: '100vw', height: '100vh' }}>
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
      <NodesOnCircle tier={1} users={usersTierOne} />
      <NodesOnCircle tier={2} users={usersTierTwo} />
      <NodesOnCircle tier={3} users={usersTierThree} />
      <NodesOnCircle tier={4} users={usersTierFour} />
      <NodesOnCircle tier={5} users={usersTierFive} />
    </Box>
  );
};

const fetchNetworkNodes = async (address: string) => {
  const res = await fetch(`/api/network/${address}`);
  const data = await res.json();
  return data;
};
