import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import iti from 'itiriri';
import * as queries from 'lib/gql/queries';
import { useNavigate, useLocation } from 'react-router';

import { useRecoilLoadCatch } from 'hooks';
import {
  rSelectedCircleId,
  rSelectedCircleIdSource,
  rCirclesMap,
  rWalletAuth,
  rCircle,
} from 'recoilState/app';
import {
  rApiManifest,
  rApiFullCircle,
  rSelfIdProfileMap,
} from 'recoilState/db';
import { paths } from 'routes/paths';
import { getApiService } from 'services/api';
import { connectors } from 'utils/connectors';
import { getSelfIdProfiles } from 'utils/selfIdHelpers';
import { assertDef } from 'utils/tools';

import { EConnectorNames } from 'types';

export const useApiBase = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateDefault = useRecoilLoadCatch(
    ({ snapshot }) =>
      async () => {
        try {
          // When navigateDefault is called, rSelectedCircleId will hang
          // if a circle isn't selected, which only should happen if the
          // user doesn't have a circle. This is all a bit too clever.
          // Ideally, clever things are isolated.
          const selectedCircleId = await Promise.race([
            snapshot.getPromise(rSelectedCircleId),
            timeoutPromise<number>(1000),
          ]);
          const {
            circleEpochsStatus: { epochIsActive },
          } = await snapshot.getPromise(rCircle(selectedCircleId));

          if (location.pathname === '/') {
            if (epochIsActive) {
              navigate(paths.allocation);
            } else {
              navigate(paths.history);
            }
          }
        } catch (e) {
          // Timed out - this just means there is no circle. Strange but it's how it works I guess -CG
        }
      },
    [history]
  );

  const updateAuth = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async ({
        address,
        web3Context,
        resetManifest,
      }: {
        address: string;
        web3Context: Web3ReactContextInterface<Web3Provider>;
        resetManifest?: boolean;
      }) => {
        const { authTokens } = await snapshot.getPromise(rWalletAuth);

        try {
          const connectorName = assertDef(
            Object.entries(connectors).find(
              ([, connector]) =>
                web3Context.connector?.constructor === connector.constructor
            )?.[0],
            'Unknown web3Context.connector'
          ) as EConnectorNames;

          const token =
            authTokens[address] ?? (await getApiService().login(address)).token;
          if (token) {
            if (resetManifest) {
              set(rApiFullCircle, new Map());
              set(rApiManifest, undefined);
            }
            set(rWalletAuth, {
              connectorName,
              address,
              authTokens: { ...authTokens, [address]: token },
            });

            return;
          }
        } catch (e) {
          console.error('Failed to login', e);
        }

        delete authTokens[address];

        set(rWalletAuth, {
          authTokens,
        });
        set(rApiFullCircle, new Map());
        set(rApiManifest, undefined);
        throw 'Failed to get a login token';
      },
    []
  );

  const logout = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async () => {
        const { authTokens: recoilTokens, address: original } =
          await snapshot.getPromise(rWalletAuth);
        const authTokens = { ...recoilTokens };

        if (original) {
          delete authTokens[original];
        }

        // Logout triggered by walletAuth removal of token.
        set(rApiFullCircle, new Map());
        set(rApiManifest, undefined);
        set(rWalletAuth, {
          authTokens,
        });
      },
    []
  );

  const fetchSelfIds = useRecoilLoadCatch(
    ({ set }) =>
      async (addresses: string[]) => {
        if (addresses.length === 0) {
          return;
        }
        const profiles = await getSelfIdProfiles(addresses);
        set(rSelfIdProfileMap, om => {
          const result = new Map(om);
          iti(profiles).forEach(p => result.set(p.address, p));
          return result;
        });
      },
    [],
    { hideLoading: true }
  );

  const fetchManifest = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async () => {
        try {
          const walletAuth = await snapshot.getPromise(rWalletAuth);
          if (
            !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
          ) {
            throw 'Wallet must be connected to fetch manifest';
          }

          const circleId = await snapshot.getPromise(rSelectedCircleIdSource);
          const manifest = await queries.fetchManifest(
            walletAuth.address,
            circleId
          );

          set(rApiManifest, manifest);
          const fullCircle = manifest.circle;
          if (fullCircle) {
            set(rSelectedCircleIdSource, fullCircle.circle.id);
            set(rApiFullCircle, m => {
              const result = new Map(m);
              result.set(fullCircle.circle.id, fullCircle);
              return result;
            });

            fetchSelfIds(fullCircle.users.map(u => u.address));
          } else {
            set(rSelectedCircleIdSource, undefined);
          }
          return manifest;
        } catch (e) {
          console.error('error fetching manifest:', e);
          throw e;
        }
      },
    []
  );

  const fetchCircle = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async ({ circleId, select }: { circleId: number; select?: boolean }) => {
        const walletAuth = await snapshot.getPromise(rWalletAuth);
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }
        if (!(await snapshot.getPromise(rCirclesMap)).has(circleId)) {
          // Wasn't included in their manifest.
          throw `Your profile doesn't have access to ${circleId}`;
        }

        const fullCircle = await queries.getFullCircle(circleId);

        // eslint-disable-next-line no-console
        console.log('fetchCircle', fullCircle);

        set(rApiFullCircle, m => {
          const result = new Map(m);
          result.set(fullCircle.circle.id, fullCircle);
          return result;
        });
        if (select) {
          set(rSelectedCircleIdSource, circleId);
        }
        fetchSelfIds(fullCircle.users.map(u => u.address));
      },
    []
  );

  const selectCircle = useRecoilLoadCatch(
    ({ snapshot, set }) =>
      async (circleId: number) => {
        const walletAuth = await snapshot.getPromise(rWalletAuth);
        if (
          !(walletAuth.address && walletAuth.address in walletAuth.authTokens)
        ) {
          throw 'Wallet must be connected to fetch manifest';
        }
        if (circleId === -1) {
          // This signifies no circle selected
          // TODO: Change to use undefined
          set(rSelectedCircleIdSource, circleId);
        }

        if (!walletAuth.address) {
          throw 'Wallet must be connected to fetch manifest';
        }
        if (!(await snapshot.getPromise(rCirclesMap)).has(circleId)) {
          // Wasn't included in their manifest.
          throw `Your profile doesn't have access to ${circleId}`;
        }

        if (!(await snapshot.getPromise(rApiFullCircle)).has(circleId)) {
          // Need to fetch this circle
          fetchCircle({ circleId, select: true });
        } else {
          set(rSelectedCircleIdSource, circleId);
        }
      },
    []
  );

  return {
    updateAuth,
    logout,
    fetchManifest,
    fetchCircle,
    selectCircle,
    navigateDefault,
    selectAndFetchCircle: (circleId: number) =>
      fetchCircle({ circleId, select: true }),
  };
};

function timeoutPromise<T>(ms: number) {
  return new Promise<T>((_, reject) => {
    setTimeout(() => reject(new Error('Timed out.')), ms);
  });
}
