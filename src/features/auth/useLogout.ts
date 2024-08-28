import { client } from 'lib/gql/client';
import { useQueryClient } from 'react-query';
import { useDisconnect } from 'wagmi';

import { useRecoilLoadCatch } from 'hooks';
import { rApiManifest } from 'recoilState';

import { logoutAndClearSavedAuth } from './helpers';
import { useAuthStore } from './store';

export const useLogout = (remote = false) => {
  const queryClient = useQueryClient();
  const { disconnect } = useDisconnect();

  const { setProfileId } = useAuthStore();

  return useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        if (remote) {
          await client.mutate(
            { logoutUser: { id: true } },
            { operationName: 'logout' }
          );
        }
        logoutAndClearSavedAuth();
        setProfileId(undefined);
        queryClient.clear();
        set(rApiManifest, undefined);
        disconnect();
      },
    []
  );
};
