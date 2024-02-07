import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';

import { useRecoilLoadCatch } from 'hooks';
import { rApiManifest } from 'recoilState';

import { useSavedAuth } from './useSavedAuth';

export const useLogout = (remote = false) => {
  const { clearSavedAuth } = useSavedAuth();
  const queryClient = useQueryClient();

  return useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        clearSavedAuth();
        queryClient.clear();
        set(rApiManifest, undefined);

        if (remote)
          await client.mutate(
            { logoutUser: { id: true } },
            { operationName: 'logout' }
          );
      },
    []
  );
};
