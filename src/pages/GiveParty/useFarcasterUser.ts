import { User } from '@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/user';
import { useQuery } from 'react-query';

export const QUERY_KEY_PARTY_PROFILE = 'partyProfile';

export const useFarcasterUser = (address: string) => {
  return useQuery([QUERY_KEY_PARTY_PROFILE, address, 'farcaster'], () =>
    fetchFarcasterUser(address)
  );
};

const fetchFarcasterUser = async (address: string) => {
  const res = await fetch(`/api/farcaster/user/${address}`);
  const data: User = await res.json();
  return data;
};
