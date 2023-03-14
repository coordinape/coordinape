import { client } from 'lib/gql/client';

import { useRecoilLoadCatch } from 'hooks';
import { rSelectedCircleIdSource } from 'recoilState/app';
import { rApiManifest, rApiFullCircle } from 'recoilState/db';

import { useSavedAuth } from './useSavedAuth';

export const useLogout = (remote = false) => {
  const { clearSavedAuth } = useSavedAuth();
  return useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        clearSavedAuth();
        set(rApiFullCircle, new Map());
        set(rApiManifest, undefined);
        set(rSelectedCircleIdSource, undefined);

        if (remote)
          await client.mutate(
            { logoutUser: { id: true } },
            { operationName: 'logout' }
          );
      },
    []
  );
};
