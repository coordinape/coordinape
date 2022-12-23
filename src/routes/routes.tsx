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
import GivePage from '../pages/GivePage';
import JoinCirclePage from '../pages/JoinCirclePage';
import isFeatureEnabled from 'config/features';
import {
  useCanVouch,
  useFixCircleState,
  useRoleInCircle,
  useShowGive,
} from 'hooks/migration';
import CircleAdminPage from 'pages/CircleAdminPage';
import CirclesPage from 'pages/CirclesPage';
import ClaimsPage from 'pages/ClaimsPage';
import ContributionsPage from 'pages/ContributionsPage';
import CreateCirclePage from 'pages/CreateCirclePage';
import DefaultPage from 'pages/DefaultPage';
import DevPortalPage from 'pages/DevPortalPage';
import DiscordPage from 'pages/DiscordPage';
import DistributionsPage from 'pages/DistributionsPage';
import HistoryPage from 'pages/HistoryPage';
import IntegrationCallbackPage from 'pages/IntegrationCallbackPage';
import MembersPage from 'pages/MembersPage';
import { NewNominationPage } from 'pages/NewNominationPage/NewNominationPage';
import OrganizationPage from 'pages/OrganizationPage';
import OrganizationSettingsPage from 'pages/OrganizationSettingsPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import { VaultTransactions } from 'pages/VaultsPage/VaultTransactions';

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
        <Route path="give" element={<GivePage />} />
        <Route path="map" element={<MapRouteHanlder />}>
          <Route path="" element={<LazyAssetMapPage />} />
        </Route>
        <Route path="contributions" element={<ContributionsPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/add" element={<AdminRouteHandler />}>
          <Route path="" element={<AddMembersPage />} />
        </Route>
        <Route path="members/nominate" element={<VouchingRouteHandler />}>
          <Route path="" element={<NewNominationPage />} />
        </Route>
        <Route path="admin" element={<AdminRouteHandler />}>
          <Route path="" element={<CircleAdminPage />} />
          <Route
            path="connect-integration"
            element={<IntegrationCallbackPage />}
          />
        </Route>

        <Route path="distributions/:epochId" element={<DistributionsPage />} />
      </Route>

      <Route path={paths.claims} element={<ClaimsPage />} />
      <Route path={paths.circles} element={<CirclesPage />} />
      <Route path={paths.createCircle} element={<CreateCirclePage />} />
      <Route path={paths.developers} element={<DevPortalPage />} />
      {isFeatureEnabled('discord') && (
        <Route path={paths.discordLink} element={<DiscordPage />} />
      )}
      <Route path={paths.home} element={<DefaultPage />} />

      <Route path={paths.organization(':orgId')}>
        <Route path="" element={<OrganizationPage />} />
        <Route path="settings" element={<OrganizationSettingsPage />} />
      </Route>

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

const VouchingRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const canVouch = useCanVouch(circleId);

  if (!canVouch) return <Redirect to={paths.home} note="not admin" />;
  return <Outlet />;
};

const MapRouteHanlder = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const showGive = useShowGive(circleId);
  const role = useRoleInCircle(circleId);

  if (!(showGive || isUserAdmin({ role })))
    return <Redirect to={paths.home} note="wait for current epoch to end" />;
  return <Outlet />;
};
