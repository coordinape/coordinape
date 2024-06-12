/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { anonClient } from 'lib/anongql/anonClient';
import { client } from 'lib/gql/client';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Avatar, Box } from 'ui';

import { NodesOnCircle, User } from './NodesOnCircle';

const QUERY_KEY_PROFILE_NETWORK = 'profileNetwork';
const QUERY_KEY_NETWORK = 'network';

export const ProfileNetwork: React.FC = () => {
  const { address } = useParams();
  const { data, isLoading: fetchCoLinksProfileIsLoading } = useQuery(
    [QUERY_KEY_PROFILE_NETWORK, address, 'profile'],
    () => fetchCoLinksProfile(address!)
  );
  const { data: networkNodes } = useQuery(
    [QUERY_KEY_NETWORK, address, 'profile'],
    () => fetchNetworkNodes(244292)
  );
  const profile = data as PublicProfile;
  const usersTierOne = (networkNodes ?? []).slice(0, 10);

  return (
    <Box css={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {profile && (
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
      )}
      <NodesOnCircle tier={1} users={usersTierOne} />
      <NodesOnCircle tier={2} users={usersTierTwo} />
      <NodesOnCircle tier={3} users={usersTierThree} />
      <NodesOnCircle tier={4} users={usersTierFour} />
      <NodesOnCircle tier={5} users={usersTierFive} />
    </Box>
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
const fetchNetworkNodes = async (fid: number) => {
  const { getNetwork } = await client.query(
    {
      getNetwork: [
        {
          payload: {
            farcaster_id: fid,
          },
        },
        {
          nodes: {
            avatar: true,
            username: true,
            profile_id: true,
            farcaster_id: true,
          },
        },
      ],
    },
    {
      operationName: 'getNetwork',
    }
  );

  return getNetwork?.nodes ?? [];
};

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;

// tier 1
// owns colinks, mutually linked in FC, GIVE transferred

// mutually linked in FC, GIVE transferred
const usersTierTwo: User[] = [
  { username: 'John' },
  { username: 'Emma' },
  { username: 'Liam' },
  { username: 'Sophia' },
  { username: 'Noah' },
  { username: 'Justine' },
  { username: 'Living' },
  { username: 'Olivia' },
  { username: 'James' },
  { username: 'Ava' },
];

// mutually linked in FC
const usersTierThree: User[] = [
  { username: 'Michael' },
  { username: 'Isabella' },
  { username: 'Ethan' },
  { username: 'Mia' },
  { username: 'Alexander' },
  { username: 'Amelia' },
  { username: 'Benjamin' },
  { username: 'Rachel' },
  { username: 'Eve' },
  { username: 'Harper' },
  { username: 'Newt' },
];

// non-mutual following
const usersTierFour: User[] = [
  { username: 'Daniel' },
  { username: 'Emily' },
  { username: 'Jacob' },
  { username: 'Madison' },
  { username: 'Matthew' },
  { username: 'Abigail' },
  { username: 'Henry' },
  { username: 'Peter' },
  { username: 'Will' },
  { username: 'Ella' },
  { username: 'Bonnine' },
];

// non-mutual followers
const usersTierFive: User[] = [
  { username: 'Samuel' },
  { username: 'Avery' },
  { username: 'Jack' },
  { username: 'Scarlett' },
  { username: 'Elijah' },
  { username: 'Victoria' },
  { username: 'Luke' },
  { username: 'Aria' },
  { username: 'Phillip' },
  { username: 'Tom' },
  { username: 'Jerry' },
  { username: 'Jerzy' },
  { username: 'Jerry' },
  { username: 'Jerzy' },
  { username: 'Spiral' },
  { username: 'Jerzy' },
  { username: 'Them' },
  { username: 'Pill' },
  { username: 'Speaker' },
  { username: 'Tea' },
];
