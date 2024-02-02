// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
import { Fragment, lazy, Suspense } from 'react';

import { Outlet, Route, Routes } from 'react-router-dom';

import { MainLayout } from '../components';
import { RequireAuth, useLoginData } from '../features/auth';
import { OrgPage, OrgSettingsPage } from '../features/orgs';
import { isUserAdmin, isUserMember } from '../lib/users';
import AccountPage from '../pages/AccountPage/AccountPage';
import AddMembersPage from '../pages/AddMembersPage/AddMembersPage';
import CircleActivityPage from '../pages/CircleActivityPage';
import CircleAdminPage from '../pages/CircleAdminPage';
import CirclesPage from '../pages/CirclesPage';
import ClaimsPage from '../pages/ClaimsPage';
import ContributionsPage from '../pages/ContributionsPage';
import CreateCirclePage from '../pages/CreateCirclePage';
import DevPortalPage from '../pages/DevPortalPage';
import DiscordPage from '../pages/DiscordPage';
import DistributionsPage from '../pages/DistributionsPage';
import GivePage from '../pages/GivePage';
import HistoryPage from '../pages/HistoryPage';
import IntegrationCallbackPage from '../pages/IntegrationCallbackPage';
import JoinPage from '../pages/JoinPage';
import MembersPage from '../pages/MembersPage';
import { NewNominationPage } from '../pages/NewNominationPage/NewNominationPage';
import OrgMembersPage, { OrgMembersAddPage } from '../pages/OrgMembersPage';
import ProfilePage from '../pages/ProfilePage';
import VaultsPage from '../pages/VaultsPage';
import { VaultTransactions } from '../pages/VaultsPage/VaultTransactions';
import VerifyEmailPage from '../pages/VerifyEmailPage';

import {
  NotReady,
  useCanVouch,
  useCircleIdParam,
  useOrgIdParam,
  useRoleInCircle,
} from './hooks';
import { givePaths } from './paths';
import { Redirect } from './RedirectAfterLogin';

const LazyAssetMapPage = lazy(() => import('pages/MapPage'));

const GiveRoutes = () => {
  return (
    <Routes>
      <Route
        path={givePaths.organization(':orgId')}
        element={<OrgRouteHandler />}
      >
        <Route path="members" element={<OrgMembersPage />} />
        <Route path="members/add" element={<OrgAdminRouteHandler />}>
          <Route path="" element={<OrgMembersAddPage />} />
        </Route>
      </Route>
      {/* circle routes that all org members can view */}
      <Route path="circles/:circleId" element={<OrgRouteHandler />}>
        <Route path="" element={<CircleActivityPage />} />
        <Route path="map" element={<LazyAssetMapPage />} />
        <Route path="members" element={<MembersPage />} />
      </Route>

      {/* circle routes that are only for circle members */}
      <Route path="circles/:circleId" element={<CircleRouteHandler />}>
        <Route path="epochs" element={<HistoryPage />} />
        <Route path="epochs/:epochId" element={<HistoryPage />} />
        <Route path="give" element={<GivePage />} />
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

      <Route path={givePaths.claims} element={<ClaimsPage />} />
      <Route path={givePaths.account} element={<AccountPage />} />
      <Route path={givePaths.createCircle} element={<CreateCirclePage />} />
      <Route path={givePaths.developers} element={<DevPortalPage />} />
      <Route path={givePaths.discordLink} element={<DiscordPage />} />

      <Route path={givePaths.organization(':orgId')}>
        <Route path="" element={<OrgPage />} />
        <Route path="settings" element={<OrgSettingsPage />} />
        <Route path="vaults" element={<VaultsPage />}>
          <Route
            path={givePaths.vaultTxs(':orgId', ':address')}
            element={<VaultTransactions />}
          />
        </Route>
      </Route>

      <Route
        path={givePaths.profile(':profileAddress')}
        element={<ProfilePage />}
      />

      <Route path={givePaths.welcome(':token')} element={<JoinPage />} />

      <Route path={givePaths.home} element={<CirclesPage />} />
      <Route
        path="/circles"
        element={<Redirect to={givePaths.home} note="legacy" />}
      />
      <Route
        path="*"
        element={<Redirect to={givePaths.home} note="catchall" />}
      />
    </Routes>
  );
};
const OrgRouteHandler = () => {
  const circleId = useCircleIdParam(false);
  const orgId = useOrgIdParam(false);

  // FIXME after org membership assignment is up & running, the circle check
  // here will be redundant and should be removed
  const role = useRoleInCircle(circleId);
  const profile = useLoginData();
  if (role === NotReady) return null;

  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });

  const isInOrg = profile?.org_members.some(m =>
    circleId
      ? m.organization.circles.some(c => c.id === circleId)
      : m.org_id === orgId
  );

  if (!isInOrg && !isInCircle)
    return <Redirect to={givePaths.home} note="not in circle or org" />;
  return <Outlet />;
};
const OrgAdminRouteHandler = () => {
  const orgId = useOrgIdParam();
  const profile = useLoginData();

  // this means "if you're a circle admin, you're an org admin."
  // this will be replaced in the future by checking org_members.role directly
  const isAdmin = profile?.org_members
    .find(m => m.org_id === orgId)
    ?.organization.circles.some(c => c.myUsers.some(isUserAdmin));

  if (!isAdmin) return <Redirect to={givePaths.home} note="not admin" />;
  return <Outlet />;
};
const CircleRouteHandler = () => {
  const circleId = useCircleIdParam();
  const role = useRoleInCircle(circleId);
  if (role === NotReady) return null;

  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });
  if (!isInCircle) return <Redirect to={givePaths.home} note="not in circle" />;
  return <Outlet />;
};
const CircleAdminRouteHandler = () => {
  const circleId = useCircleIdParam();
  const role = useRoleInCircle(circleId);
  if (role === NotReady) return null;

  if (!isUserAdmin({ role }))
    return <Redirect to={givePaths.home} note="not admin" />;
  return <Outlet />;
};
const VouchingRouteHandler = () => {
  const circleId = useCircleIdParam();
  const canVouch = useCanVouch(circleId);
  if (canVouch === NotReady) return null;

  if (!canVouch) return <Redirect to={givePaths.home} note="cannot vouch" />;
  return <Outlet />;
};

export const giveRoutes = [
  <Fragment key={'giveRoutes'}>
    <Route
      element={
        <MainLayout>
          <Outlet />
        </MainLayout>
      }
    >
      <Route path={givePaths.join(':token')} element={<JoinPage />} />
      <Route path={givePaths.verify(':uuid')} element={<VerifyEmailPage />} />
      <Route
        path="*"
        element={
          <RequireAuth>
            <Suspense fallback={null}>
              <GiveRoutes />
            </Suspense>
          </RequireAuth>
        }
      />
    </Route>
  </Fragment>,
];
