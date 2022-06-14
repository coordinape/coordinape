import React, { lazy } from 'react';

import debug from 'debug';
import { isUserAdmin, isUserMember } from 'lib/users';
import {
  Routes,
  Route,
  Navigate,
  useParams,
  Outlet,
  useLocation,
} from 'react-router-dom';

import DevPortalPage from '../pages/DevPortalPage';
import { useFixCircleState, useRoleInCircle } from 'hooks/migration';
import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CirclesPage from 'pages/CirclesPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DistributionsPage from 'pages/DistributionsPage';
import HistoryPage from 'pages/HistoryPage';
import IntegrationCallbackPage from 'pages/IntegrationCallbackPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import { VaultTransactions } from 'pages/VaultsPage/VaultTransactions';
import VouchingPage from 'pages/VouchingPage';

import { paths } from './paths';
const log = debug('routes');

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/AssetMapPage'));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="circles/:circleId" element={<CircleRouteHandler />}>
        <Route path="history" element={<HistoryPage />} />
        <Route path="allocation" element={<AllocationPage />} />
        <Route path="team" element={<AllocationPage />} />
        <Route path="epoch" element={<AllocationPage />} />
        <Route path="give" element={<AllocationPage />} />
        <Route path="map" element={<LazyAssetMapPage />} />
        <Route path="vouching" element={<VouchingPage />} />
        <Route path="admin" element={<AdminRouteHandler />}>
          <Route path="" element={<AdminPage />} />
          <Route
            path="connect-integration"
            element={<IntegrationCallbackPage />}
          />
        </Route>

        <Route path="distributions/:epochId" element={<DistributionsPage />} />
      </Route>

      <Route path={paths.circles} element={<CirclesPage />} />
      <Route path={paths.createCircle} element={<CreateCirclePage />} />
      <Route path={paths.developers} element={<DevPortalPage />} />
      <Route path={paths.home} element={<DefaultPage />} />
      <Route
        path={paths.profile(':profileAddress')}
        element={<ProfilePage />}
      />
      <Route path={paths.vaults} element={<VaultsPage />} />
      <Route
        path={paths.vaultTxs(':address')}
        element={<VaultTransactions />}
      />

      <Route path="*" element={<Redirect to={paths.home} note="catchall" />} />
    </Routes>
  );
};

const Redirect = ({ to, note = '' }: { to: string; note?: string }) => {
  const location = useLocation();
  log(`redirecting ${location.pathname} -> ${to} | ${note}`);
  return <Navigate to={to} replace />;
};

const CircleRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const role = useRoleInCircle(circleId);
  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });

  useFixCircleState(isInCircle ? circleId : undefined);

  if (!isInCircle) return <Redirect to={paths.home} note="not in circle" />;
  return <Outlet />;
};

const AdminRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const role = useRoleInCircle(circleId);

  if (!isUserAdmin({ role }))
    return <Redirect to={paths.home} note="not admin" />;
  return <Outlet />;
};
