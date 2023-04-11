import { useQuery } from 'react-query';

import { useFetchManifest } from 'hooks/legacyApi';

import type { Awaited } from 'types/shim';

export const QUERY_KEY_LOGIN_DATA = 'loginData';

export const useLoginData = () => {
  const fetchManifest = useFetchManifest();

  // this is always fetched on page load during useFinishAuth
  const { data } = useQuery(
    QUERY_KEY_LOGIN_DATA,
    async () => {
      const { profiles_by_pk } = await fetchManifest();
      return profiles_by_pk;
    },
    { staleTime: Infinity }
  );
  return data;
};

export type MyUser = NonNullable<
  Awaited<ReturnType<typeof useLoginData>>
>['users'][0];
