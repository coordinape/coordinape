/* eslint-disable @typescript-eslint/no-unused-vars */

import { anonClient } from 'lib/anongql/anonClient';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { PartyBody } from './PartyBody';
import { PartyHeader } from './PartyHeader';
import { PartyProfileContent } from './PartyProfileContent';

const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const PartyProfile = () => {
  const { address } = useParams();
  const { data, isLoading: fetchCoLinksProfileIsLoading } = useQuery(
    [QUERY_KEY_PARTY_PROFILE, address, 'profile'],
    () => fetchCoLinksProfile(address!)
  );

  const targetProfile = data as PublicProfile;
  if (!targetProfile) return;
  return (
    <>
      <PartyBody>
        <PartyHeader />
        <PartyProfileContent address={address!} />
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
