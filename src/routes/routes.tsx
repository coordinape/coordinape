import { Fragment, lazy, Suspense } from 'react';

import { RequireAuth, useLoginData } from 'features/auth';
import {
  MintPage,
  SplashPage,
  ViewPage as CoSoulViewPage,
} from 'features/cosoul';
import { CoSoulArtPublic } from 'features/cosoul/art/CoSoulArtPublic';
import CoSoulArtOnlyLayout from 'features/cosoul/CoSoulArtOnlyLayout';
import CoSoulLayout from 'features/cosoul/CoSoulLayout';
import { DebugCoSoulGalleryPage } from 'features/cosoul/DebugCoSoulGalleryPage';
import { OrgPage, OrgSettingsPage } from 'features/orgs';
import { isUserAdmin, isUserMember } from 'lib/users';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useSearchParams,
} from 'react-router-dom';

import { DebugLogger } from '../common-lib/log';
import { isFeatureEnabled } from '../config/features';
import { CoLinksLayout } from '../features/colinks/CoLinksLayout';
import { CoLinksWizardLayout } from '../features/colinks/CoLinksWizardLayout';
import AddMembersPage from '../pages/AddMembersPage/AddMembersPage';
import CircleActivityPage from '../pages/CircleActivityPage';
import { ActivityPage } from '../pages/colinks/ActivityPage';
import { LinkHistoryPage } from '../pages/colinks/LinkHistoryPage';
import { LinkHoldersPage } from '../pages/colinks/LinkHoldersPage';
import { LinkHoldingsPage } from '../pages/colinks/LinkHoldingsPage';
import { RepScorePage } from '../pages/colinks/RepScorePage';
import { TradesPage } from '../pages/colinks/TradesPage';
import { ViewProfilePage } from '../pages/colinks/ViewProfilePage/ViewProfilePage';
import { WizardPage } from '../pages/colinks/WizardPage';
import { WizardStart } from '../pages/colinks/WizardStart';
import CoSoulExplorePage from '../pages/CoSoulExplorePage/CoSoulExplorePage';
import GivePage from '../pages/GivePage';
import { InviteCodePage } from '../pages/InviteCodePage';
import JoinPage from '../pages/JoinPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import { MainLayout } from 'components';
import AccountPage from 'pages/AccountPage/AccountPage';
import CircleAdminPage from 'pages/CircleAdminPage';
import CirclesPage from 'pages/CirclesPage';
import ClaimsPage from 'pages/ClaimsPage';
import ContributionsPage from 'pages/ContributionsPage';
import CreateCirclePage from 'pages/CreateCirclePage';
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

import {
  NotReady,
  useCanVouch,
  useCircleIdParam,
  useOrgIdParam,
  useRecordPageView,
  useRoleInCircle,
} from './hooks';
import { paths } from './paths';

const logger = new DebugLogger('routes');

// TODO: The graph page might be where code splitting can really help load time
// but that would require the graph libraries to only be imported there.
// look into this.
const LazyAssetMapPage = lazy(() => import('pages/MapPage'));

const RedirectAfterLogin = () => {
  const [params] = useSearchParams();
  return <Redirect to={params.get('next') || '/'} note="RedirectAfterLogin" />;
};

const Redirect = ({ to, note = '' }: { to: string; note?: string }) => {
  const location = useLocation();
  logger.log(`redirecting ${location.pathname} -> ${to} | ${note}`);
  return <Navigate to={to} replace />;
};
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

      <Route path={paths.claims} element={<ClaimsPage />} />
      <Route path={paths.account} element={<AccountPage />} />
      <Route path={paths.createCircle} element={<CreateCirclePage />} />
      <Route path={paths.developers} element={<DevPortalPage />} />
      <Route path={paths.discordLink} element={<DiscordPage />} />

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

      <Route path={paths.welcome(':token')} element={<JoinPage />} />

      <Route path={paths.home} element={<CirclesPage />} />
      <Route
        path="/circles"
        element={<Redirect to={paths.home} note="legacy" />}
      />
      <Route path="*" element={<Redirect to={paths.home} note="catchall" />} />
    </Routes>
  );
};

export const AppRoutes = () => {
  useRecordPageView();

  return (
    <Routes>
      <Route path={paths.coLinksInvite(':code')} element={<InviteCodePage />} />
      {/* CoSoul Pages */}
      <Route
        element={
          <CoSoulArtOnlyLayout>
            <Outlet />
          </CoSoulArtOnlyLayout>
        }
      >
        <Route
          path={paths.cosoulArt(':tokenId')}
          element={<CoSoulArtPublic />}
        />
        <Route
          path={paths.cosoulImage(':tokenId')}
          element={<CoSoulArtPublic animate={false} />}
        />
        <Route
          path={paths.cosoulGallery}
          element={<DebugCoSoulGalleryPage />}
        />
      </Route>
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
          path={paths.cosoulView(':address')}
          element={<CoSoulViewPage />}
        />
        <Route path={paths.cosoulExplore} element={<CoSoulExplorePage />} />
        <Route
          path={paths.mint}
          element={
            <RequireAuth>
              <MintPage />
            </RequireAuth>
          }
        />
      </Route>

      {/*CoLinks Routes*/}
      {isFeatureEnabled('soulkeys') && (
        <Fragment>
          <Route
            element={
              <RequireAuth>
                <CoLinksLayout>
                  <Outlet />
                </CoLinksLayout>
              </RequireAuth>
            }
          >
            <Route path={paths.coLinks} element={<ActivityPage />} />
            <Route
              path={paths.coLinksProfile(':address')}
              element={<ViewProfilePage />}
            />
            <Route path={paths.coLinksTrades} element={<TradesPage />} />
            <Route
              path={paths.coLinksExplore}
              element={<CoSoulExplorePage />}
            />
            <Route path={paths.coLinksAccount} element={<AccountPage />} />
            <Route path={paths.coLinksActivity} element={<ActivityPage />} />
            <Route
              path={paths.coLinksLinksHistory(':address')}
              element={<LinkHistoryPage />}
            />
            <Route
              path={paths.coLinksLinkHoldings(':address')}
              element={<LinkHoldingsPage />}
            />
            <Route
              path={paths.coLinksLinkHolders(':address')}
              element={<LinkHoldersPage />}
            />
            <Route
              path={paths.coLinksRepScore(':address')}
              element={<RepScorePage />}
            />
          </Route>

          <Route
            element={
              <CoLinksWizardLayout>
                <Outlet />
              </CoLinksWizardLayout>
            }
          >
            <Route path={paths.coLinksWizardStart} element={<WizardStart />} />
          </Route>

          <Route
            element={
              <RequireAuth>
                <CoLinksWizardLayout>
                  <Outlet />
                </CoLinksWizardLayout>
              </RequireAuth>
            }
          >
            <Route path={paths.coLinksWizard} element={<WizardPage />} />
          </Route>
        </Fragment>
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
        <Route path={paths.join(':token')} element={<JoinPage />} />
        <Route path={paths.verify(':uuid')} element={<VerifyEmailPage />} />
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
    return <Redirect to={paths.home} note="not in circle or org" />;
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

  if (!isAdmin) return <Redirect to={paths.home} note="not admin" />;
  return <Outlet />;
};

const CircleRouteHandler = () => {
  const circleId = useCircleIdParam();
  const role = useRoleInCircle(circleId);
  if (role === NotReady) return null;

  const isInCircle = isUserMember({ role }) || isUserAdmin({ role });
  if (!isInCircle) return <Redirect to={paths.home} note="not in circle" />;
  return <Outlet />;
};

const CircleAdminRouteHandler = () => {
  const circleId = useCircleIdParam();
  const role = useRoleInCircle(circleId);
  if (role === NotReady) return null;

  if (!isUserAdmin({ role }))
    return <Redirect to={paths.home} note="not admin" />;
  return <Outlet />;
};

const VouchingRouteHandler = () => {
  const circleId = useCircleIdParam();
  const canVouch = useCanVouch(circleId);
  if (canVouch === NotReady) return null;

  if (!canVouch) return <Redirect to={paths.home} note="cannot vouch" />;
  return <Outlet />;
};
