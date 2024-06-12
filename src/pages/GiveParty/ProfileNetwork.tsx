/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';

import { fetchCoSoul } from 'features/colinks/fetchCoSouls';
import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { Avatar, Box } from 'ui';

import { NodesOnCircle, User } from './NodesOnCircle';

const QUERY_KEY_PROFILE_NETWORK = 'profileNetwork';

export const ProfileNetwork: React.FC = () => {
  const { address } = useParams();
  const { data, isLoading: fetchCoLinksProfileIsLoading } = useQuery(
    [QUERY_KEY_PROFILE_NETWORK, address, 'profile'],
    () => fetchCoLinksProfile(address!)
  );
  const profile = data as PublicProfile;
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

export type PublicProfile = NonNullable<
  Required<Awaited<ReturnType<typeof fetchCoLinksProfile>>>
>;
// owns colinks, mutually linked in FC, GIVE transferred
const usersTierOne: User[] = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  { name: 'David' },
  { name: 'Eve' },
  { name: 'Frank' },
  { name: 'Grace' },
];

// mutually linked in FC, GIVE transferred
const usersTierTwo: User[] = [
  { name: 'John' },
  { name: 'Emma' },
  { name: 'Liam' },
  { name: 'Sophia' },
  { name: 'Noah' },
  { name: 'Justine' },
  { name: 'Living' },
  { name: 'Olivia' },
  { name: 'James' },
  { name: 'Ava' },
];

// mutually linked in FC
const usersTierThree: User[] = [
  { name: 'Michael' },
  { name: 'Isabella' },
  { name: 'Ethan' },
  { name: 'Mia' },
  { name: 'Alexander' },
  { name: 'Amelia' },
  { name: 'Benjamin' },
  { name: 'Rachel' },
  { name: 'Eve' },
  { name: 'Harper' },
  { name: 'Newt' },
];

// non-mutual following
const usersTierFour: User[] = [
  { name: 'Daniel' },
  { name: 'Emily' },
  { name: 'Jacob' },
  { name: 'Madison' },
  { name: 'Matthew' },
  { name: 'Abigail' },
  { name: 'Henry' },
  { name: 'Peter' },
  { name: 'Will' },
  { name: 'Ella' },
  { name: 'Bonnine' },
];

// non-mutual followers
const usersTierFive: User[] = [
  { name: 'Samuel' },
  { name: 'Avery' },
  { name: 'Jack' },
  { name: 'Scarlett' },
  { name: 'Elijah' },
  { name: 'Victoria' },
  { name: 'Luke' },
  { name: 'Aria' },
  { name: 'Phillip' },
  { name: 'Tom' },
  { name: 'Jerry' },
  { name: 'Jerzy' },
  { name: 'Jerry' },
  { name: 'Jerzy' },
  { name: 'Spiral' },
  { name: 'Jerzy' },
  { name: 'Them' },
  { name: 'Pill' },
  { name: 'Speaker' },
  { name: 'Tea' },
];
