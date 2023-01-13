import debug from 'debug';
import { IAuth, rWalletAuth } from 'features/auth/useWalletAuth';
import * as queries from 'lib/gql/queries';

import { useRecoilLoadCatch } from 'hooks';
import { rSelectedCircleIdSource } from 'recoilState/app';
import { rApiManifest, rApiFullCircle } from 'recoilState/db';

const log = debug('useApiBase');

export const useApiBase = () => {
  const fetchManifest = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async (newWalletAuth?: IAuth) => {
        const walletAuth =
          newWalletAuth || (await snapshot.getPromise(rWalletAuth));
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }

        const manifest = await queries.fetchManifest(walletAuth.address);
        set(rApiManifest, manifest);
      },
    [],
    { who: 'fetchManifest' }
  );

  const unselectCircle = useRecoilLoadCatch(
    ({ set }) =>
      async () => {
        set(rSelectedCircleIdSource, undefined);
      },
    []
  );

  const fetchCircle = useRecoilLoadCatch(
    ({ set }) =>
      async ({ circleId, select }: { circleId: number; select?: boolean }) => {
        const fullCircle = await queries.getFullCircle(circleId);

        set(rApiFullCircle, m => {
          const result = new Map(m);
          result.set(fullCircle.circle.id, fullCircle);
          return result;
        });

        if (select) set(rSelectedCircleIdSource, circleId);
      },
    [],
    { who: 'fetchCircle' }
  );

  const selectCircle = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async (circleId: number) => {
        const fullCircles = await snapshot.getPromise(rApiFullCircle);
        if (fullCircles.has(circleId)) {
          set(rSelectedCircleIdSource, circleId);
          return;
        }

        // Need to fetch this circle
        log(`selectCircle -> fetchCircle ${circleId}`);
        await fetchCircle({ circleId, select: true });
      },
    [],
    { who: 'selectCircle' }
  );

  return {
    fetchManifest,
    fetchCircle,
    selectCircle,
    unselectCircle,
  };
};
