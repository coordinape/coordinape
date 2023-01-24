import { client } from 'lib/gql/client';

import { useRecoilLoadCatch } from 'hooks';
import { rSelectedCircleIdSource } from 'recoilState/app';
import { rApiManifest, rApiFullCircle } from 'recoilState/db';

import { rSavedAuth } from './useSavedAuth';

export const useLogout = (remote = false) =>
  useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        set(rSavedAuth, { authTokens: {} });
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
