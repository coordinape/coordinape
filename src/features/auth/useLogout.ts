import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { useDisconnect } from 'wagmi';

import { useRecoilLoadCatch } from 'hooks';
import { rApiManifest } from 'recoilState';

import { useSavedAuth } from './useSavedAuth';

export const useLogout = (remote = false) => {
  const { clearSavedAuth } = useSavedAuth();
  const queryClient = useQueryClient();
  const { disconnect } = useDisconnect();

  return useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        clearSavedAuth();
        queryClient.clear();
        set(rApiManifest, undefined);
        disconnect();

        if (remote)
          await client.mutate(
            { logoutUser: { id: true } },
            { operationName: 'logout' }
          );
      },
    []
  );
};
