import { useQuery } from 'react-query';

import { useApiBase } from 'hooks/useApiBase';

export const QUERY_KEY_LOGIN_DATA = 'loginData';

export const useLoginData = () => {
  const { fetchManifest } = useApiBase();

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
