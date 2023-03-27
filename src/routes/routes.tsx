import { lazy, Suspense } from 'react';

import { RequireAuth, useLoginData } from 'features/auth';
import { MintPage, SplashPage } from 'features/cosoul';
import CoSoulLayout from 'features/cosoul/CoSoulLayout';
import { OrgPage, OrgSettingsPage } from 'features/orgs';
import { isUserAdmin, isUserMember } from 'lib/users';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { DebugLogger } from '../common-lib/log';
import AddMembersPage from '../pages/AddMembersPage/AddMembersPage';
import CircleActivityPage from '../pages/CircleActivityPage';
import GivePage from '../pages/GivePage';
import JoinCirclePage from '../pages/JoinCirclePage';
import { MainLayout } from 'components';
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
import OrgMembersPage, { OrgMembersAddPage } from 'pages/OrgMembersPage';
import ProfilePage from 'pages/ProfilePage';
import VaultsPage from 'pages/VaultsPage';
import { VaultTransactions } from 'pages/VaultsPage/VaultTransactions';

import { paths } from './paths';

const logger = new DebugLogger('routes');

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/AssetMapPage'));

const LoggedInRoutes = () => {
  return (
    <Routes>
      <Route path={paths.organization(':orgId')} element={<OrgRouteHandler />}>
        <Route path="members" element={<OrgMembersPage />} />
        <Route path="members/add" element={<OrgAdminRouteHandler />}>
          <Route path="" element={<OrgMembersAddPage />} />
        </Route>
      </Route>

      {/* circle routes that all org members can view */}
      <Route path="circles/:circleId" element={<OrgRouteHandler />}>
        <Route path="" element={<CircleActivityPage />} />
        <Route path="members" element={<MembersPage />} />
      </Route>

      {/* circle routes that are only for circle members */}
      <Route path="circles/:circleId" element={<CircleRouteHandler />}>
        <Route path="epochs" element={<HistoryPage />} />
        <Route path="give" element={<GivePage />} />
        <Route path="map" element={<MapRouteHandler />}>
          <Route path="" element={<LazyAssetMapPage />} />
        </Route>
        <Route path="contributions" element={<ContributionsPage />} />
        <Route path="members/add" element={<CircleAdminRouteHandler />}>
          <Route path="" element={<AddMembersPage />} />
        </Route>
        <Route path="members/nominate" element={<VouchingRouteHandler />}>
          <Route path="" element={<NewNominationPage />} />
        </Route>
        <Route path="admin" element={<CircleAdminRouteHandler />}>
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
      <Route path={paths.discordLink} element={<DiscordPage />} />
      <Route path={paths.home} element={<DefaultPage />} />

      <Route path={paths.organization(':orgId')}>
        <Route path="" element={<OrgPage />} />
        <Route path="settings" element={<OrgSettingsPage />} />
        <Route path="vaults" element={<VaultsPage />}>
          <Route
            path={paths.vaultTxs(':orgId', ':address')}
            element={<VaultTransactions />}
          />
        </Route>
      </Route>

      <Route
        path={paths.profile(':profileAddress')}
        element={<ProfilePage />}
      />

      <Route path={paths.invite(':token')} element={<JoinCirclePage />} />
      <Route path="*" element={<Redirect to={paths.home} note="catchall" />} />
    </Routes>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* CoSoul Pages */}
      {isFeatureEnabled('cosoul') && (
        <Route
          element={
            <CoSoulLayout>
              <Outlet />
            </CoSoulLayout>
          }
        >
          <Route
            path="login"
            element={
              <RequireAuth>
                <RedirectAfterLogin />
              </RequireAuth>
            }
          />
          <Route path={paths.cosoul} element={<SplashPage />} />
          <Route
            path={paths.mint}
            element={
              <RequireAuth>
                <MintPage />
              </RequireAuth>
            }
          />
        </Route>
      )}

      {/* Main App Pages */}
      <Route
        element={
          <MainLayout>
            <Outlet />
          </MainLayout>
        }
      >
        <Route
          path="login"
          element={
            <RequireAuth>
              <RedirectAfterLogin />
            </RequireAuth>
          }
        />
        <Route path={paths.join(':token')} element={<JoinCirclePage />} />
        <Route
          path="*"
          element={
            <RequireAuth>
              <Suspense fallback={null}>
                <LoggedInRoutes />
              </Suspense>
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  );
};

const RedirectAfterLogin = () => {
  const [params] = useSearchParams();
  return <Redirect to={params.get('next') || '/'} note="RedirectAfterLogin" />;
};

const Redirect = ({ to, note = '' }: { to: string; note?: string }) => {
  const location = useLocation();
  logger.log(`redirecting ${location.pathname} -> ${to} | ${note}`);
  return <Navigate to={to} replace />;
};

const OrgRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const orgId = Number(params.orgId);

  // FIXME after org membership assignment is up & running, the circle check
  // here will be redundant and should be removed
  const role = useRoleInCircle(circleId);
  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });
  const profile = useLoginData();

  const isInOrg = profile?.org_members.some(m =>
    circleId
      ? m.organization.circles.some(c => c.id === circleId)
      : m.org_id === orgId
  );

  const ready = useFixCircleState(isInOrg || isInCircle ? circleId : undefined);

  if (!isInOrg && !isInCircle)
    return <Redirect to={paths.home} note="not in circle or org" />;
  return ready ? <Outlet /> : null;
};

const OrgAdminRouteHandler = () => {
  const params = useParams();
  const orgId = Number(params.orgId);

  const profile = useLoginData();

  // this means "if you're a circle admin, you're an org admin."
  // this will be replaced in the future by checking org_members.role directly
  const isAdmin = profile?.org_members
    .find(m => m.org_id === orgId)
    ?.organization.circles.some(c => c.myUsers.some(isUserAdmin));

  if (!isAdmin) return <Redirect to={paths.home} note="not admin" />;
  return <Outlet />;
};

const CircleRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const role = useRoleInCircle(circleId);
  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });
  const ready = useFixCircleState(isInCircle ? circleId : undefined);

  if (!isInCircle) return <Redirect to={paths.home} note="not in circle" />;
  return ready ? <Outlet /> : null;
};

const CircleAdminRouteHandler = () => {
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

const MapRouteHandler = () => {
  const params = useParams();
  const circleId = Number(params.circleId);
  const showGive = useShowGive(circleId);
  const role = useRoleInCircle(circleId);

  if (!(showGive || isUserAdmin({ role })))
    return <Redirect to={paths.home} note="wait for current epoch to end" />;
  return <Outlet />;
};
