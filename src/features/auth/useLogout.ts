import { client } from 'lib/gql/client';

import { useRecoilLoadCatch } from 'hooks';
import { rApiManifest } from 'recoilState';

import { useSavedAuth } from './useSavedAuth';

export const useLogout = (remote = false) => {
  const { clearSavedAuth } = useSavedAuth();
  return useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        clearSavedAuth();
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
