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

import AddMembersPage from '../pages/AddMembersPage/AddMembersPage';
import JoinCirclePage from '../pages/JoinCirclePage';
import { useFixCircleState, useRoleInCircle } from 'hooks/migration';
import AdminCircleApiPage from 'pages/AdminCircleApiPage/AdminCircleApiPage';
import AdminPage from 'pages/AdminPage';
import AllocationPage from 'pages/AllocationPage';
import CircleAdminPage from 'pages/CircleAdminPage';
import CirclesPage from 'pages/CirclesPage';
import ClaimsPage from 'pages/ClaimsPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DevPortalPage from 'pages/DevPortalPage';
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
  const allocationPage = <AllocationPage />;
  return (
    <Routes>
      <Route path="circles/:circleId" element={<CircleRouteHandler />}>
        <Route path="history" element={<HistoryPage />} />
        <Route path="allocation" element={allocationPage} />
        <Route path="team" element={allocationPage} />
        <Route path="epoch" element={allocationPage} />
        <Route path="give" element={allocationPage} />
        <Route path="map" element={<LazyAssetMapPage />} />
        <Route path="vouching" element={<VouchingPage />} />
        <Route path="members" element={<AdminRouteHandler />}>
          <Route path="add" element={<AddMembersPage />} />
          <Route path="" element={<AdminPage />} />
        </Route>
        <Route path="admin" element={<AdminRouteHandler />}>
          <Route path="" element={<CircleAdminPage />} />
          <Route
            path="connect-integration"
            element={<IntegrationCallbackPage />}
          />
          <Route path="api" element={<AdminCircleApiPage />} />
        </Route>

        <Route path="distributions/:epochId" element={<DistributionsPage />} />
      </Route>

      <Route path={paths.claims} element={<ClaimsPage />} />
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

      <Route
        path={paths.vaultTxs(':address')}
        element={<VaultTransactions />}
      />

      <Route path={paths.join(':token')} element={<JoinCirclePage />} />

      <Route path={paths.invite(':token')} element={<JoinCirclePage />} />
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
